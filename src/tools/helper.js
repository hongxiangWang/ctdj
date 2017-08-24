// o => original
//只针对kvword格式
function createTableArr(oJsonArr, row) {
    let outArr = [];
    oJsonArr.forEach(value => {
        let json = {};
        for (let k in value) {
            if (k != 'type') {
                json.label = value[k];
                json.value = (row[k] == null || row[k] == '') ? '无' : row[k];
                json.type = value['type'];
                json.key = k;
            }
        }
        outArr.push(json)
    })
    return outArr;
}


function createTableToForm(oJsonArr) {
    let outArr = [];
    oJsonArr.forEach(value => {
        let json = {};
        for (let k in value) {
            if (k != 'type') {
                json.label = value[k];
                json.value = null;
                json.type = value['type'];
                json.key = k;
            }
        }
        outArr.push(json)
    })
    return outArr;
}


//select数据处理
function selectDataShow(selectProps, selectArr, cell) {
    selectProps.forEach(v => {
        if (cell.key == v) {
            selectArr[v].forEach(value => {
                if (value.value == cell.value) {
                    cell.value = value.label;
                }
            });
        }
    })
}


function downloadFile(url) {
    try {
        var elemIF = document.createElement("iframe");
        elemIF.src = url;
        console.log('----encodeURI---', url)
        elemIF.style.display = "none";
        document.body.appendChild(elemIF);
    } catch (e) {

    }
}

function getSelectLabel(arr, s) {
    let str = '';
    arr.forEach(v => {
        if (v.value == s) {
            str = v.label;
        }
    })
    return str
}

function stringToArray(str) {
    let arr= [];
    let re = /^[0-9]+.?[0-9]*$/;
    str.split('|').forEach(v=>{
        if(v!=null&& v!=''){
            if(re.test(v)){
                arr.push(Number(v))
            }else{
                arr.push(v)
            }

        }
    })
    return arr
}


module.exports.createTableArr = createTableArr;
module.exports.createTableToForm = createTableToForm;
module.exports.selectDataShow = selectDataShow;
module.exports.downloadFile = downloadFile;
module.exports.getSelectLabel = getSelectLabel;
module.exports.stringToArray = stringToArray;
