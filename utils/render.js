const path=require('path')
const {readFileSync}=require('fs')
const dirname=require('../dirname')

async function render(title, paths) {
    const pathsToArr = paths.split('\n').filter((path) => path)
   const pathsRendered= pathsToArr.map((path) => {
        return `<div class="dirlink"><a href="${path}">${path}</a></div>`
   })
    const length = pathsRendered.length
    const arrToStr = pathsRendered.join('\n')
    const html = `
    <h2>${title}</h2>
    <a href="../">../</a> <br><br>
    ${length<1 ? '<h4>Empty Directory</h4>' : ''}
    ${arrToStr}
    ${length ? `<h5>${length} items</h5>` : ''}
    `
    const boilerplate = await readFileSync(path.join(dirname(), 'templates', 'main.html'), {
        encoding: 'utf-8'
    })
    return boilerplate.replace('$title',title).replace('$content', html)
}

module.exports = render