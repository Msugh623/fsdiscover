const ffmpeg = require('fluent-ffmpeg')
const os = require('os')
const { PassThrough } = require('stream')

// Create a PassThrough stream to handle the ffmpeg output
const outputStream = new PassThrough()

module.exports.screenCast = (res) => {
    // Determine the platform and set the appropriate input options
    let inputOptions
    if (os.platform() === 'linux') {
        inputOptions = {
            input: ':0.0+0,0', // Capture the entire screen
            inputFormat: 'x11grab' // Use x11grab for screen capture
        }
    } else if (os.platform() === 'darwin') {
        inputOptions = {
            input: 'default:none', // Capture the entire screen
            inputFormat: 'avfoundation' // Use avfoundation for screen capture
        }
    } else if (os.platform() === 'win32') {
        inputOptions = {
            input: 'desktop', // Capture the entire screen
            inputFormat: 'gdigrab' // Use gdigrab for screen capture
        }
    } else {
        console.error('Unsupported platform')
        process.exit(1)
    }

    res.writeHead(200, {
        'Content-Type': 'video/webm',
        'Transfer-Encoding': 'chunked'
    })

    // Start screen recording and pipe the output to the PassThrough stream
    ffmpeg()
        .input(inputOptions.input)
        .inputFormat(inputOptions.inputFormat)
        .videoCodec('libvpx') // Use libvpx codec for video encoding
        .audioCodec('libvorbis') // Use libvorbis codec for audio encoding
        .format('webm') // Use webm format for streaming
        .outputOptions([
            '-r 30', // Set frame rate to 30 fps
            '-s 1920x1080', // Set resolution to 1920x1080
            '-pix_fmt yuv420p' // Set pixel format
        ])
        .on('start', (commandLine) => {
            console.log('Started ffmpeg with command: ' + commandLine)
        })
        .on('error', (err, stdout, stderr) => {
            console.log('An error occurred: ' + err.message)
            console.log('ffmpeg stdout: ' + stdout)
            console.log('ffmpeg stderr: ' + stderr)
        })
        .on('end', () => {
            console.log('Screen recording finished')
        })
        .pipe(outputStream, { end: true })

    outputStream.pipe(res)
}