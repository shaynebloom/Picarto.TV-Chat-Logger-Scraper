// ==UserScript==
// @name         Chat Logger
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://picarto.tv/**USERNAME**
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at      document-end
// ==/UserScript==

(function() {
    'use strict';
    var storageName = "storedMsgArray";
    
    setInterval(updateMsgList, 1000);

    function msgFormatter(str) {
        let newStr = str.replace(/\<span class\="rosRel"\>\<span class\="removeContainer"\>\<i class\="far fa\-fw fa\-times msgRemove"\>\<\/i\>\<i title\="confirm" class\="far fa\-fw fa\-check msgRemoveConfirm ml\-1" data\-rm\-id\="[0-9]*" style\="display\:none;"\>\<\/i\>\<\/span\>\<\/span\>/g, "");
        newStr = newStr.replace(/\<span class\="rosRel"\>\<span class\="removeContainer"\>\<i class\="far fa\-fw fa\-times msgRemove"\>\<\/i\>\<i title\="confirm" class\="far fa\-fw fa\-check msgRemoveConfirm" data\-rm\-id\="[0-9]*" style\="display\:none;"\>\<\/i\>\<\/span\>\<\/span\>/g, "");
        newStr = newStr.replace(/\<img[^:]*"\:|\:"[^:]*"\>/g, ":");
        newStr = newStr.replace(/\<a href\=.*noreferrer"\>|\<\/a\>/g, "");
        return newStr;
    }

    function getStoredArray() {
        return JSON.parse(GM_getValue(storageName, []));
    }

    function setStoredArray(arr) {
        GM_setValue(storageName, JSON.stringify(arr));
    }

    function getMsgObj(name, timestamp, msg, msgID) {
        return { "name":name, "timestamp":timestamp, "text":msg, "msgID":msgID };
    }

    function getMessages() { // returns array of message objects
        let data = document.getElementsByClassName('messageli');
        let msgList = new Array();
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].getElementsByClassName('theMsg').length; j++) {
                msgList.push(getMsgObj(data[i].getElementsByClassName('chat_usr_ava')[0].title,
                                          data[i].getElementsByClassName('infoContent')[0].getElementsByClassName('timestamp')[0].innerText,
                                          msgFormatter(data[i].getElementsByClassName('theMsg')[j].innerHTML),
                                          data[i].getElementsByClassName('theMsg')[j].id));
            }
        }
        return msgList;
    }

    function updateMsgList() {
        let oldList = getStoredArray();
        let newList = getMessages();

        let index = 0;
        for (let i = newList.length - 1; i >= 0 && true; i--) { // Find if last stored message is in newList, so we don't add the same messages
            if(oldList.length == 0) {
                index = 0;
                break;
            }
            if(oldList[oldList.length - 1].msgID == newList[i].msgID) {
                index = i + 1;
                break; // If message id matches, then set index to index after matching id and break loop
            }
        }

        for(let i = index; i < newList.length; i++) {
            oldList.push(newList[i]);
            //alert("New msg added!");
        }

        setStoredArray(oldList);

        if(document.getElementById('msg').value === "/download") {
            document.getElementById('msg').value = "";
            downloadMsgList();
        }
    }

    function downloadMsgList() {
        let msgList = getStoredArray();
        let txtStr = ""
        for(let i = 0; i < msgList.length; i++) {
            txtStr += "(" + msgList[i].timestamp + ")";
            txtStr += " " + msgList[i].name + ": ";
            txtStr += msgList[i].text + "\n";
        }

        var a = document.createElement("a");
        a.href = "data:text," + txtStr;
        a.download = "ChatLog.txt";
        a.click();
    }
})();
