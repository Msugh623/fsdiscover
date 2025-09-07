export default {
    open: (data) => {
        const a = document.getElementById("url-mounter");
        a.href = data.pathname
        a.target="_blank"
        a.click()
        a.href = ""
        navigator.vibrate(50)
    }
}