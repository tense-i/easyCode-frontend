<template>
    <div class="app-container centered-90" >
        <el-text class="mx-1" style="font-size: 32px;">Jasypt 在线加解密工具</el-text>
        <div style="margin: 20px 0"/>
        <el-row :gutter="10">
            <el-col :span="10">
                <el-input
                        v-model="encDto.encryptMessage"
                        style="width: 100%"
                        :rows="8"
                        type="textarea"
                        placeholder="原文"
                />
            </el-col>
            <el-col :span="4">
                <el-row>
                    <el-input
                            v-model="encDto.password"
                            style="width: 100%"
                            :rows="2"
                            type="textarea"
                            placeholder="加密密码"
                    />
                </el-row>
                <div style="margin: 20px 0"/>
                <el-row>
                    <el-button
                            type="primary"
                            text
                            style="width: 100%"
                            @click="handleJasyptEncrypt">
                        <el-icon>
                            <DArrowRight/>
                        </el-icon>
                        <el-icon>
                            <DArrowRight/>
                        </el-icon>
                        <el-icon>
                            <DArrowRight/>
                        </el-icon>
                        <el-icon>
                            <Lock/>
                        </el-icon>
                    </el-button>
                </el-row>
                <div style="margin: 20px 0"/>
                <el-row>
                    <el-button
                            type="primary"
                            text
                            style="width: 100%"
                            @click="handleJasyptDecrypt">
                        <el-icon>
                            <Unlock/>
                        </el-icon>
                        <el-icon>
                            <DArrowLeft/>
                        </el-icon>
                        <el-icon>
                            <DArrowLeft/>
                        </el-icon>
                        <el-icon>
                            <DArrowLeft/>
                        </el-icon>
                    </el-button>
                </el-row>

            </el-col>
            <el-col :span="10">
                <el-input
                        v-model="encDto.decryptMessage"
                        style="width: 100%"
                        :rows="8"
                        type="textarea"
                        placeholder="密文"
                />
            </el-col>
        </el-row>


    </div>
</template>


<script setup name="Enc">

import {jasyptDecrypt, jasyptEncrypt} from "@/api/tool/encryption.js";

const data = reactive({
    encDto: {
        encryptMessage: "",
        password: "",
        decryptMessage: ""
    }
});

const {encDto} = toRefs(data);

// 加密
function handleJasyptEncrypt() {
    let queryData = {
        password: data.encDto.password,
        message: data.encDto.encryptMessage
    }
    jasyptEncrypt(queryData).then(res => {
        if (res.code === 200) {
            data.encDto.decryptMessage = res.data
        }
    })
}

// 加密
function handleJasyptDecrypt() {
    let queryData = {
        password: data.encDto.password,
        message: data.encDto.decryptMessage
    }
    jasyptDecrypt(queryData).then(res => {
        if (res.code === 200) {
            data.encDto.encryptMessage = res.data
        }
    })
}
</script>


<style>
.centered-90 {
    width: 90%;
    margin: 0 auto;
}
</style>
