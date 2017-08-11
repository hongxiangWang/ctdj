import axios from 'axios'
import config from '../api/config'
const axiosInit = axios.create(config);
import {app} from '../main.js'

export default {
    getRoleFun({commit, state}, prop) {
        axiosInit.post('/access/access_list_by_roleid', {'role_id': prop},{headers:{token:require('store').get('token')}}).then(res => {
            let flg = res.data.errno;
            switch (flg) {
                case 0:
                    commit('GET_ROLE_FUN', res.data.data);
                    break;
                case 1:
                    app.$message({message:'用户权限数据为空',type:'error'})
                    commit('GET_ROLE_FUN', []);
                    break;
                default: {

                }
            }
        }).catch(error => {
            alert(error)
        })
    },

}
