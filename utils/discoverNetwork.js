const os = require('os');

class NetworkProbe {
    constructor() {
        this.networkInterfaces = os.networkInterfaces();
        this.interfaceNames= Object.keys(this.networkInterfaces);
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
        console.log(`NetProbe: Found ${this.interfaceNames.length} network interfaces: ${this.interfaceNames.join(', ')}`)
    
        // Wired Network Preference
        const eth = faceNames.find(face => face.includes('enp')) || 
                    faceNames.find(face => face.includes('eth')) || 
                    faceNames.find(face => face.includes('Ethernet')) || 
                    faceNames.find(face => face.includes('en')) || 
                    faceNames.find(face => face.includes('eth0'))
        if (eth) {
            console.log(`NetProbe: Found what seems to be a wired network... Using ${eth} as the preferred network interface`)
            const theface = this.networkInterfaces[eth]
            const theNetwork = theface.find((network) => this.isIpAddr(network.address))
            faceNames = this.interfaceNames.filter(face => !face.includes(eth))
            return theNetwork
        }
    
        // No ETH use other Network Preference
        const faces = faceNames.map(face => (this.networkInterfaces[face] || [])).flat()
        if (faces.length === 0) {
            console.log(`NetProbe: No network interfaces found... Falling back to native loopback interface`)
            return this.getLocalNetwork()
        }
       
        console.log(`NetProbe: Couldn't find a wired network... Using a wireless network interface`)
        const othernetFace = faces.find((network) => this.isIpAddr(network.address)) 
        console.log(`NetProbe: Found a wireless IPv4 network... Using ${othernetFace.address} as the preferred network`)
        return othernetFace
    }

}

module.exports = NetworkProbe;