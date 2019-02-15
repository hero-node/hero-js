import { exec } from "child_process";

function ss() {
    exec("apt-get install python-pip")
    exec("pip install git+https://github.com/shadowsocks/shadowsocks.git@master")
    exec("sudo ssserver -p 443 -k password -m aes-256-cfb --user nobody -d start")
}


module.exports = {
    ss,
};