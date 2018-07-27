<template>
    <div class="scan-url-table-container">
        <h2>当前截屏配置名称：{{settingName}}</h2>
        <el-table :data="webSites" style="width: 100%">
            <el-table-column prop="url" label="网址">
            </el-table-column>
            <el-table-column label="上次截图时间">
                <template slot-scope="scope">
                    {{lastScanTime}}
                </template>
            </el-table-column>
            <el-table-column label="本次截图时间">
                <template slot-scope="scope">
                    {{currentScanTime}}
                </template>
            </el-table-column>
            <el-table-column label="查看截图">
                <template slot-scope="scope">
                    <el-tag v-for="resolution in resolutions" size="mini" :key="resolution">
                        <span @click="checkScreenShot(scope.row.url, {resolution: resolution})">{{resolution}}</span>
                    </el-tag>
                    <el-tag v-for="model in models" size="mini" :key="model">
                        <span @click="checkScreenShot(scope.row.url, {model: model})">{{model}}</span>
                    </el-tag>
                    <el-tag v-for="width in fullScreenWidth" size="mini" :key="width">
                        <span @click="checkScreenShot(scope.row.url, {width: width})">{{'FullScreen-' + width}}</span>
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini">对比分析</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
        title="截屏任务进行中"
        :visible.sync="showProgress"
        width="30%"
        :before-close="handleClose">
            <span>一共有{{totcalCount}}个截图任务进行中，已完成{{finishedCount}}个</span>
            <el-progress :text-inside="true" :stroke-width="18" :percentage="parseInt(finishedCount/totcalCount*100)" status="success"></el-progress>
        </el-dialog>
    </div>
</template>

<script>
import {
    getScanSettings,
    setScanSettings,
} from '@/utils/setting';
import {
    userDataPath
} from '@/service/coreService';
import { formatDate } from '@/utils/index';
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
            lastScanTime: null,
            currentScanTime: null,
        };
    },
    created() {
        this.webSites = this.setting.webSites;
        this.webSites.map((ele) => {
            ele.status = 'connecting'
        });
        if (this.setting.scanTime.length > 1) {
            this.lastScanTime = this.setting.scanTime[this.setting.scanTime.length - 2];
        }
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
            let scanTime = formatDate(new Date(), '{y}-{m}-{d} {h}:{i}:{s}');
            this.currentScanTime = scanTime;
            const appConfig = getScanSettings();
            let settings = appConfig.settings;
            let currentSetting = settings.find(ele => ele.settingName === this.settingName);
            currentSetting.scanTime.push(scanTime);
            const timeIndex = currentSetting.scanTime.length - 1;
            setScanSettings(appConfig);
            for (let i = 0; i < this.setting.webSites.length; i++) {
                let config = {}
                config.url = this.setting.webSites[i].url;
                if (this.setting.models.length > 0) {
                    for (let j = 0; j < this.setting.models.length; j++) {
                        config.width = config.height = null;
                        config.model = this.setting.models[j];
                        config.path = this.setting.savePath;
                        let url = config.url.replace('')
                        config.fileName = this.setting.settingName + '--' + 'websites[' + i + ']' + '--' + this.setting.models[j].replace(' ', '_') + '--time[' + timeIndex +'].png';
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
                        config.fileName = this.setting.settingName + '--' + 'websites[' + i + ']' + '--' + this.setting.resolutions[k] + '--time[' + timeIndex +'].png';
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
                        config.fileName = this.setting.settingName + '--' + 'websites[' + i + ']' + '--' + 'FullScreen' + config.width + '--time[' + timeIndex +'].png';
                        await screenShot(config);
                        this.finishedCount++;
                    }
                    
                }
                this.showProgress = false;
                this.setting.webSites[i].status = 'finished';
            }
        },

        checkScreenShot(url, info) {
            let filePath;
            let websiteIndex = this.setting.webSites.findIndex( ele => ele.url === url);
            if (info.) {

            }

        },

        handleClose() {
            if (this.finishedCount !== this.totcalCount) {
                this.$message.error('截图进行中，请稍等');
                return false;
            } else {
                return true;
            }
        },

        checkProgress() {
            if (this.finishedCount !== this.totcalCount) {
                this.$message.error('截图进行中，请稍等');
            } else {
                this.showProgress = false;
            }
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
