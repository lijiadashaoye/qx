/*************************************************************************
 * Copyright (C) 2016-2019 The PDX Blockchain Hypercloud Authors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 *************************************************************************/
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
const messages={
	zh: {
        locale:'EN', 
        h5:{
           checkYes:"校验通过",
           checkYes2:"上链原始内容如下，请您校验。",
           checkNo:'验证未通过！',
           checkNo2:'该证书已吊销。',
           checkNo3:'该证书上链信息无效。',
           blickInfo:'区块链信息',
           height:"区块高度",
           time:'时间',
           trHas:'交易哈希',
           blcikHash:'区块哈希',
           certificateHash:'证书哈希',
           from:'发送方',
           to:'接收方'
        },
        ...zhLocale
   },
   en: {
        locale:'中',
        h5:{
            
           blickInfo:'Blockchain info',
           height:"Block height",
           time:'Time',
           trHas:'Transaction hash',
           blcikHash:'Block hash',
           certificateHash:'Certificate hash',
           from:'from',
           to:'to',
           checkYes:"Check passed",
           checkYes2:"The original content of the chain is as follows, please verify.",
           checkNo:'Verification failed!',
           checkNo2:'The certificate has been revoked.',
           checkNo3:'The chain information of the certificate is invalid.',
        },
        ...enLocale
   }
   
}
 
export default messages;