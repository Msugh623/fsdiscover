const { default: axios } = require('axios');
const os = require('os');

class NetworkProbe {
    /**
    * @param {function} callback - A callback function to be called after the network interface is detected
    * @param {number} port - A port number to check if the network interface is live
    * @param {function} fallback - A callback function to be called if the network interface is not live
    * @param {boolean} v - A boolean to enable verbose logging
    * @returns {object} - Returns the network prober object
    * @description - A class to auto detect the network interface and check if it is live
    * @example
    * const netProb =new NetworkProbe()
    * const netFace = netProb.autoDetect()
    * netProb.liveCheck()
    * console.log(netFace)
    * // Output: { address: '', netmask: '', family: 'IPv4', mac: '', internal: false }
    */
    constructor(port = 3000, callback = (() => { }), v = false, fallback) {
        this.verbose = v;
        this.port=port
        this.networkInterfaces = os.networkInterfaces();
        this.interfaceNames = Object.keys(this.networkInterfaces);
        this.netface = {};
        this.callback = callback || (() => { });
        this.fallback = fallback || (() => { });
        this.heartbeat=true
        setInterval(() => {
            this.liveCheck(port,(err,live)=>{
                if (err) {
                    this.heartbeat = false
                    this.fallback()
                    console.error(err)
                    console.log(`NetProbe: Network is offline... No fallback supplied. Retrying heartbeat in 5 seconds\n`)
                };
                if (live) {
                    if (!this.heartbeat) {
                        console.log(`\nNetProbe: Network is back online @ http://${this.netface.address}:${port}`)
                        this.heartbeat = true
                    }
                }
            });
        }
        ,5000)
    }

    isIpAddr(ip) {
        const ipArr = ip.split('.');
        if (ipArr.length !== 4) {
        return false;
        }
        return ipArr.every((num) => {
        const n = parseInt(num, 10);
        return n >= 0 && n <= 255;
        });
    }

    getLocalNetwork() {
        return (this.networkInterfaces?.lo||[]).find(network => this.isIpAddr(network.address)) 
    }
    
    autoDetect() {
        let faceNames = this.interfaceNames.filter(face => !face.includes('lo'))
       this.verbose&& console.log(`NetProbe: Found ${this.interfaceNames.length} network interfaces: ${this.interfaceNames.join(', ')}`)
    
        // Wired Network Preference
        const eth = faceNames.find(face => face.includes('enp')) || 
                    faceNames.find(face => face.includes('eth')) || 
                    faceNames.find(face => face.includes('ETH')) || 
                    faceNames.find(face => face.includes('Ethernet')) || 
                    faceNames.find(face => face.includes('en')) || 
                    faceNames.find(face => face.includes('eth0'))
        if (eth) {
           this.verbose&& console.log(`NetProbe: Found what seems to be a wired network... Using ${eth} as the preferred network interface`)
            const theface = this.networkInterfaces[eth]
            const theNetwork = theface.find((network) => this.isIpAddr(network.address))
            faceNames = this.interfaceNames.filter(face => !face.includes(eth))
            this.netface=theNetwork;
            return theNetwork
        }
    
        // No ETH use other Network Preference
        const faces = faceNames.map(face => (this.networkInterfaces[face] || [])).flat()
        if (faces.length === 0) {
           this.verbose&& console.log(`NetProbe: No network interfaces found... Falling back to native loopback interface`)
            const lo = this.getLocalNetwork()
            this.netface=lo;
            return lo
        }
       
       this.verbose&& console.log(`NetProbe: Couldn't find a wired network... Using a wireless network interface`)
        const othernetFace = faces.find((network) => this.isIpAddr(network.address)) 
       this.verbose&& console.log(`NetProbe: Found a wireless IPv4 network... Using ${othernetFace.address} as the preferred network`)
        this.netface=othernetFace;
        return othernetFace
    }

    liveCheck(port=this.port,cb=((err=Error,live=false)=>{}),verbose=false) {
        const netFace = this.netface;
        axios.head(`http://${netFace.address}:${port}`)
        .then((_) => {
           verbose && console.log(`NetProbe: http://${netFace.address}:${port} is live`)
            cb(null,true)
        }).catch((_) => {
              const err=`NetProbeLiveCheck: !Faliure... http://${netFace.address}:${port} Heartbeat failed DT: ${new Date()}`
              cb(err,false)
              verbose && console.error(err)
        });
    }
}

// const netProb = new NetworkProbe();
// const netFace = netProb.autoDetect();
// netProb.liveCheck((err,live)=>{
//     if(err) console.error(err);
//     if(live) console.log(`\nFS Explorer is live @ http://${netFace.address}:3000`)
// })
// console.log(netFace);

module.exports = NetworkProbe;