<template>
    <div id="login">
        <div id="login-box">
            <el-card class="box-card">
                <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="0" label-position="left"
                         class="demo-ruleForm">
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <span @keyup.enter="submitForm('ruleForm2')">
                                <el-form-item prop="phone">
                                    <el-input type="phone" v-model="ruleForm2.phone" auto-complete="on"
                                              placeholder="协同账号"></el-input>
                                </el-form-item>
                            </span>
                        </el-col>
                        <el-col :span="8">
                            <span @keyup.enter="submitForm('ruleForm2')">
                                <el-form-item prop="checkPass">
                                    <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off"
                                              placeholder="协同密码"></el-input>
                                </el-form-item>
                            </span>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item>
                                <el-button id="entry" type="primary" @click="submitForm('ruleForm2')">登录
                                </el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-card>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'login',
        data() {
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入协同账号'));
                } else {
                    //&& (/^1[34578]\d{9}$/.test(this.ruleForm2.phone))
                    if (this.ruleForm2.phone !== '') {
                        callback();
                    } else {
                        callback(new Error('请输入协同密码'));
                    }
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    callback();
                }
            };
            return {
                ruleForm2: {
                    phone: '',
                    checkPass: ''
                },
                rules2: {
                    phone: [
                        {validator: validatePass, trigger: 'blur'}
                    ],
                    checkPass: [
                        {validator: validatePass2, trigger: 'blur'}
                    ]
                },
                time: "获取验证码",
                isDisabled: false
            };
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let params = {
                            username: this.ruleForm2.phone,
                            userpwd: this.ruleForm2.checkPass
                        }
                        this.$ajax.post('/admin/login', params).then(response => {
                            console.log(response);
                            switch (Number(response.data.errno)) {
                                case 0 :
                                    getAccount(this, response.data.data);
                                    this.$router.replace('/home/main');
                                    break;
                                default:
                                    console.log(response.data)
                                    this.$message({message: response.data.errmsg, type: 'error'})
                            }
                            //console.log(response.data.data.flg)
                        }).catch(error => {
                            console.log(error.message);
                            this.$message({message: error.message, type: 'error'})
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            getSecurity() {
                this.$ajax.post('/user/sendmsg', {phs_number: this.ruleForm2.phone}).then(response => {
                    if (response.data.data === '00') {
                        let count = 30;
                        this.$notify({
                            message: "验证码已下发到" + this.ruleForm2.phone + '手机，请注意查收',
                            type: 'success',
                            title: '成功'
                        })
                        countdown(this, count)
                    } else {
                        this.$message({message: response.data.data, type: 'error'})
                    }

                }).catch(error => {
                    console.log(error.message)
                })
            }
        },
        mounted() {
            let account = GetQueryString('account');
            let token = GetQueryString('token');
            let params = {
                account: account,
                token: token,
            }
            if (account == null) {
                return;
            }
            this.$ajax.post('/user/login', params).then(response => {
                console.log('sssss', response.errno)
                switch (Number(response.errno)) {
                    case 0 :
                        getAccount(this, response.data.data);
                        //this.$router.replace('/home');
                        let url = window.location.host + '/home'
                        window.location.replace('/dist/#/home');
                        break;
                    default:
                        console.log(response.data)
                        this.$message({message: response.data.data.msg, type: 'error'})
                }
            }).catch(error => {
                this.$message({message: error, type: 'error'})
            })
        }
    }

    function countdown(vm, count) {
        if (count === 0) {
            vm.time = '获取验证码'
            count = 150;
            vm.isDisabled = false;
            return;
        }
        vm.isDisabled = true;
        setTimeout(() => {
            count--;
            vm.time = '  ' + count + 's  '
            countdown(vm, count)
        }, 1000)
    }

    function getAccount(vm, data) {
        vm.$localStore.set('token', data.token);
        vm.$localStore.set('people_info', data.people_info);
        vm.$localStore.set('user_access_list', data.user_access_list);
    }

    //获取URL参数
    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    import '../../assets/style/login.less'
    import '../../assets/elCss/input.css'
</script>