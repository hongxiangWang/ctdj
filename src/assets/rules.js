const telNum =
  [
    {required: true, message: '不许为空'},
    {
      validator(rule, value, callback, source, options) {
        var errors = [];
        if (value.length > 11) {
          errors.push(new Error('不得大于11位'));
        }
        if (!/^[0-9]\d*$/.test(value)) {
          errors.push(new Error('必须是数字'));
        }
        callback(errors);
      }
    }
  ]
const agencyIdCard = [
  {type:'string',required: true, message: '不许为空'},
  {
    validator(rule, value, callback, source, options) {
      var errors = [];

      if (!/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/.test(value)) {
        errors.push(new Error('请输入正确15位或18位省份证号'));
      }

      callback(errors);
    }
  }]

const notEmpty = [{required: true, message: '不许为空'}]

const needSelect = [{required: true, message: '请选择', trigger: 'change'}]
export {
  telNum,agencyIdCard,notEmpty,needSelect
}


