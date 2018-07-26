<template>
    <div class="scan-url-table-container">
        <el-table :data="webSites" style="width: 100%">
            <el-table-column prop="url" label="网址">
            </el-table-column>
            <el-table-column label="上次截图时间">
            </el-table-column>
            <el-table-column label="查看截图">
                <template slot-scope="scope">
                    <el-tag v-for="resolution in resolutions" size="mini" :key="resolution">{{resolution}}</el-tag>
                    <el-tag v-for="model in models" size="mini" :key="model">{{model}}</el-tag>
                    <el-tag v-for="width in fullScreenWidth" size="mini" :key="width">{{'fullScreen-' + width}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="对比分析">
                <template slot-scope="scope">
                    <el-button plain size="mini">开始分析</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
        title="截屏任务进行中"
        :visible.sync="showProgress"
        width="30%"
        :before-close="handleClose">
        <span>一共有{{totcalCount}}个截图任务进行中，已完成{{finishedCount}}个</span>
        <el-slider v-model="finishedCount" :step="totcalCount">
        </el-slider>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
import {
    userDataPath
} from '@/service/coreService';
const PATH = require('path');
const fs = require('fs');
import screenShot from '@/utils/screenshot';

export default {
    name: 'scanUrlTable',
    props: {
        setting: {
            type: Object,
            default: null,
        },
    },
    data() {
        return {
            webSites: [],
            settingName: '',
            resolutions: [],
            models: [],
            fullScreenWidth: [],
            screenshots: [],
            totcalCount: null,
            finishedCount: null,
            showProgress: false,
        };
    },
    created() {
        this.webSites = this.setting.webSites;
        this.webSites.map((ele) => {
            ele.status = 'connecting'
        });
        this.settingName = this.setting.settingName;
        this.resolutions = this.setting.resolutions.concat([]);
        this.models = this.setting.models.concat([]);
        this.fullScreenWidth = this.setting.fullScreenWidth.concat([]);
    },
    mounted() {
        console.log(this.setting);
    },
    methods: {
        async startScan() {
            this.showProgress = true;
            this.finishedCount = 0;
            this.totcalCount = this.setting.webSites.length * (this.setting.models.length + this.setting.resolutions.length + this.setting.fullScreenWidth.length);
            for (let i = 0; i < this.setting.webSites.length; i++) {
                let config = {}
                config.url = this.setting.webSites[i].url;
                if (this.setting.models.length > 0) {
                    for (let j = 0; j < this.setting.models.length; j++) {
                        config.width = config.height = null;
                        config.model = this.setting.models[j];
                        config.path = this.setting.savePath;
                        let url = config.url.replace('')
                        config.fileName = 'websites[' + i + ']' + '-' + this.setting.models[j].replace(' ', '_') + '-' + this.setting.settingName + '.png';
                        await screenShot(config);
                        this.finishedCount++;
                    }
                }
                if (this.setting.resolutions.length > 0) {
                    for (let k = 0; k < this.setting.resolutions.length; k++) {
                        config.model = null;
                        config.width = parseInt(this.setting.resolutions[k].split("X")[0]);
                        config.height = parseInt(this.setting.resolutions[k].split("X")[1]);
                        config.path = this.setting.savePath;
                        config.fileName = 'websites[' + i + ']' + '-' + this.setting.resolutions[k] + '-' + this.setting.settingName + '.png';
                        await screenShot(config);
                        this.finishedCount++;
                    }
                }
                if (this.setting.fullScreenWidth.length > 0) {
                    for (let z = 0; z < this.setting.fullScreenWidth.length; z++) {
                        config.fullPage = true;
                        config.model = null;
                        config.width = parseInt(this.setting.fullScreenWidth[z]);
                        config.height = 1000;
                        config.path = this.setting.savePath;
                        config.fileName = 'websites[' + i + ']' + '-' + 'fullScreen' + config.width + '-' + this.setting.settingName + '.png';
                        await screenShot(config);
                        this.finishedCount++;
                    }
                    
                }
                this.setting.webSites[i].status = 'finished';
            }
        },

        handleClose() {

        },
    },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-table{
    .el-tag--mini{
        margin-right: 5px;
        cursor: pointer;
    }
}
</style>
