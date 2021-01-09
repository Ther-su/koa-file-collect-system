(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["register"],{"3e34":function(e,r,t){"use strict";t("57f9")},"57f9":function(e,r,t){},d5c2:function(e,r,t){"use strict";t.r(r);var s=function(){var e=this,r=e.$createElement,t=e._self._c||r;return t("div",{staticClass:"register-container"},[t("el-tabs",{staticClass:"tab-container",attrs:{type:"card"},model:{value:e.activeName,callback:function(r){e.activeName=r},expression:"activeName"}},[t("el-tab-pane",{attrs:{label:"学生注册",name:"student"}},[t("el-form",{ref:"studentRegisterFormRef",attrs:{model:e.studentRegisterForm,"status-icon":"",rules:e.studentRegisterFormRules,size:"small"}},[t("el-form-item",{attrs:{prop:"userName",label:"用户名"}},[t("el-input",{attrs:{"prefix-icon":"el-icon-user"},model:{value:e.studentRegisterForm.userName,callback:function(r){e.$set(e.studentRegisterForm,"userName",r)},expression:"studentRegisterForm.userName"}})],1),t("el-form-item",{attrs:{prop:"fullName",label:"真实姓名"}},[t("el-input",{model:{value:e.studentRegisterForm.fullName,callback:function(r){e.$set(e.studentRegisterForm,"fullName",r)},expression:"studentRegisterForm.fullName"}},[t("span",{staticClass:"svg-container",attrs:{slot:"prefix"},slot:"prefix"},[t("svg-icon",{attrs:{"icon-class":"full-name"}})],1)])],1),t("el-form-item",{attrs:{label:"性别",prop:"gender"}},[t("el-select",{attrs:{placeholder:"请选择"},model:{value:e.studentRegisterForm.gender,callback:function(r){e.$set(e.studentRegisterForm,"gender",r)},expression:"studentRegisterForm.gender"}},[t("el-option",{attrs:{label:"男",value:"1"}}),t("el-option",{attrs:{label:"女",value:"2"}})],1)],1),t("el-form-item",{attrs:{prop:"gradeId",label:"班级代号"}},[t("el-input",{model:{value:e.studentRegisterForm.gradeId,callback:function(r){e.$set(e.studentRegisterForm,"gradeId",r)},expression:"studentRegisterForm.gradeId"}},[t("span",{staticClass:"svg-container",attrs:{slot:"prefix"},slot:"prefix"},[t("svg-icon",{attrs:{"icon-class":"grade"}})],1)])],1),t("el-form-item",{attrs:{prop:"studentNumber",label:"学号"}},[t("el-input",{attrs:{"prefix-icon":"el-icon-info"},model:{value:e.studentRegisterForm.studentNumber,callback:function(r){e.$set(e.studentRegisterForm,"studentNumber",r)},expression:"studentRegisterForm.studentNumber"}})],1),t("el-form-item",{attrs:{prop:"password",label:"密码"}},[t("el-input",{attrs:{"prefix-icon":"el-icon-lock",type:"password"},model:{value:e.studentRegisterForm.password,callback:function(r){e.$set(e.studentRegisterForm,"password",r)},expression:"studentRegisterForm.password"}})],1),t("el-form-item",{staticClass:"btns"},[t("el-button",{attrs:{type:"primary",loading:e.loading},on:{click:e.handleRegister}},[e._v("注册")]),t("el-button",{attrs:{type:"default"},on:{click:e.toLogin}},[e._v("已有账户?去登陆")])],1)],1)],1),t("el-tab-pane",{attrs:{label:"学委注册",name:"admin"}},[t("el-form",{ref:"adminRegisterFormRef",attrs:{model:e.adminRegisterForm,"status-icon":"",rules:e.adminRegisterFormRules,size:"mini"}},[t("el-form-item",{attrs:{prop:"userName",label:"用户名"}},[t("el-input",{attrs:{"prefix-icon":"el-icon-user"},model:{value:e.adminRegisterForm.userName,callback:function(r){e.$set(e.adminRegisterForm,"userName",r)},expression:"adminRegisterForm.userName"}})],1),t("el-form-item",{attrs:{prop:"fullName",label:"真实姓名"}},[t("el-input",{model:{value:e.adminRegisterForm.fullName,callback:function(r){e.$set(e.adminRegisterForm,"fullName",r)},expression:"adminRegisterForm.fullName"}},[t("span",{staticClass:"svg-container",attrs:{slot:"prefix"},slot:"prefix"},[t("svg-icon",{attrs:{"icon-class":"full-name"}})],1)])],1),t("el-form-item",{attrs:{label:"性别",prop:"gender"}},[t("el-select",{attrs:{placeholder:"请选择"},model:{value:e.adminRegisterForm.gender,callback:function(r){e.$set(e.adminRegisterForm,"gender",r)},expression:"adminRegisterForm.gender"}},[t("el-option",{attrs:{label:"男",value:"1"}}),t("el-option",{attrs:{label:"女",value:"2"}})],1)],1),t("el-form-item",{attrs:{prop:"school",label:"学校"}},[t("el-input",{model:{value:e.adminRegisterForm.school,callback:function(r){e.$set(e.adminRegisterForm,"school",r)},expression:"adminRegisterForm.school"}},[t("span",{staticClass:"svg-container",attrs:{slot:"prefix"},slot:"prefix"},[t("svg-icon",{attrs:{"icon-class":"school"}})],1)])],1),t("el-form-item",{attrs:{prop:"major",label:"专业"}},[t("el-input",{model:{value:e.adminRegisterForm.major,callback:function(r){e.$set(e.adminRegisterForm,"major",r)},expression:"adminRegisterForm.major"}},[t("span",{staticClass:"svg-container",attrs:{slot:"prefix"},slot:"prefix"},[t("svg-icon",{attrs:{"icon-class":"school"}})],1)])],1),t("el-form-item",{attrs:{prop:"gradeName",label:"班级"}},[t("el-input",{model:{value:e.adminRegisterForm.gradeName,callback:function(r){e.$set(e.adminRegisterForm,"gradeName",r)},expression:"adminRegisterForm.gradeName"}},[t("span",{staticClass:"svg-container",attrs:{slot:"prefix"},slot:"prefix"},[t("svg-icon",{attrs:{"icon-class":"grade"}})],1)])],1),t("el-form-item",{attrs:{prop:"studentNumber",label:"学号"}},[t("el-input",{attrs:{"prefix-icon":"el-icon-info"},model:{value:e.adminRegisterForm.studentNumber,callback:function(r){e.$set(e.adminRegisterForm,"studentNumber",r)},expression:"adminRegisterForm.studentNumber"}})],1),t("el-form-item",{attrs:{prop:"password",label:"密码"}},[t("el-input",{attrs:{"prefix-icon":"el-icon-goods",type:"password"},model:{value:e.adminRegisterForm.password,callback:function(r){e.$set(e.adminRegisterForm,"password",r)},expression:"adminRegisterForm.password"}})],1),t("el-form-item",[t("el-button",{attrs:{type:"primary",loading:e.loading},on:{click:e.handleRegister}},[e._v("注册")]),t("el-button",{attrs:{type:"default"},on:{click:e.toLogin}},[e._v("已有账户?去登陆")])],1)],1)],1)],1)],1)},a=[],i=t("61f7"),l={data:function(){return{activeName:"student",loading:!1,studentRegisterForm:{userName:"Ther",password:"SU123456",fullName:"林峰",gender:"1",role:"student",studentNumber:"202030192752",gradeId:"f88cb0a8182934774f73eb9778eeb305"},adminRegisterForm:{studentNumber:"201930167321",userName:"伊藤美来",password:"SU123456",fullName:"伊藤美来",gender:"1",role:"admin",gradeName:"3班",major:"软件工程",school:"清华大学"},studentRegisterFormRules:{userName:[{required:!0,message:"请输入登录用户名",trigger:"blur"},{validator:Object(i["a"])(i["l"],"用户名为2-10个字符的数字、字母、汉字"),trigger:"blur"}],fullName:[{required:!0,message:"请输入真实姓名",trigger:"blur"},{validator:Object(i["a"])(i["e"],"姓名为2-10个字符的字母或汉字"),trigger:"blur"}],gender:[{required:!0,message:"请输入性别",trigger:"blur"}],password:[{required:!0,message:"请输入登录密码",trigger:"blur"},{validator:Object(i["a"])(i["i"],"密码由6-10个字符的字母和汉字组成"),trigger:"blur"}],gradeId:[{required:!0,message:"请输入班级代号",trigger:"blur"},{validator:Object(i["a"])(i["g"],"班级代号由32位字符组成"),trigger:"blur"}],studentNumber:[{required:!0,message:"请输入学号",trigger:"blur"},{validator:Object(i["a"])(i["k"],"学号为2-32位数字"),trigger:"blur"}]},adminRegisterFormRules:{userName:[{required:!0,message:"请输入登录用户名",trigger:"blur"},{validator:Object(i["a"])(i["l"],"用户名为2-10个字符的数字、字母、汉字"),trigger:"blur"}],fullName:[{required:!0,message:"请输入真实姓名",trigger:"blur"},{validator:Object(i["a"])(i["e"],"姓名为2-10个字符的字母或汉字"),trigger:"blur"}],gender:[{required:!0,message:"请输入性别",trigger:"blur"}],password:[{required:!0,message:"请输入登录密码",trigger:"blur"},{validator:Object(i["a"])(i["i"],"密码由6-10个字符的字符组成"),trigger:"blur"}],gradeName:[{required:!0,message:"请输入班级",trigger:"blur"},{validator:Object(i["a"])(i["f"],"班级代号由2-15个字符组成"),trigger:"blur"}],school:[{required:!0,message:"请输入学校",trigger:"blur"},{validator:Object(i["a"])(i["j"],"学校由2-30个字符组成"),trigger:"blur"}],major:[{required:!0,message:"请输入专业",trigger:"blur"},{validator:Object(i["a"])(i["h"],"专业由2-15个字符组成"),trigger:"blur"}],studentNumber:[{required:!0,message:"请输入学号",trigger:"blur"},{validator:Object(i["a"])(i["k"],"学号为2-32位数字"),trigger:"blur"}]}}},methods:{toLogin:function(){this.$router.push("/login")},handleRegister:function(){var e=this;this.$refs.studentRegisterFormRef.validate((function(r){if(!r)return!1;e.loading=!0;var t=null;t="student"===e.activeName?e.studentRegisterForm:e.adminRegisterForm,e.$store.dispatch("user/register",t).then((function(){e.loading=!1,e.$confirm("注册成功, 是否跳转到首页?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"success"}).then((function(){e.$router.push({path:"/"})}))})).catch((function(){e.loading=!1}))}))}}},o=l,n=(t("3e34"),t("5d22")),m=Object(n["a"])(o,s,a,!1,null,"a8ba3fa8",null);r["default"]=m.exports}}]);