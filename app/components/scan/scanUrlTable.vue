<template>
    <div class="scan-url-table-container">
        <el-row>
            <el-form :inline="true">
                <el-form-item v-for="resolution in resolutions" :key="resolution">
                    <el-tag>{{resolution}}</el-tag>
                </el-form-item>
            </el-form>
        </el-row>
        <el-table :data="webSites" style="width: 100%">
            <el-table-column prop="url" label="网址">
            </el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    {{scope.row.status}}
                </template>
            </el-table-column>
            <el-table-column label="查看截图">
                <template slot-scope="scope">
                    <el-tag v-for="resolution in resolutions" size="mini" :key="resolution">{{resolution}}</el-tag>
                </template>
            </el-table-column>
        </el-table>
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
            screenshots: [],
        };
    },
    created() {
        this.webSites = this.setting.webSites;
        this.webSites.map((ele) => {
            ele.status = 'connecting'
        });
        this.settingName = this.setting.settingName;
        this.resolutions = this.setting.resolutions.concat([]);
    },
    mounted() {
        console.log(this.setting);
    },
    methods: {
        async startScan() {
            for (let i = 0; i < this.setting.webSites.length; i++) {
                let config = {}
                config.url = this.setting.webSites[i].url;
                debugger
                if (this.setting.models.length > 0) {
                    for (let j = 0; j < this.setting.models.length; j++) {
                        config.width = config.height = null;
                        config.model = this.setting.models[j];
                        config.path = this.setting.savePath;
                        config.fileName = this.setting.models[j].replace(' ', '_') + '-' + this.setting.settingName + '.jpg';
                        await screenShot(config);
                    }
                }
                if (this.setting.resolutions.length > 0) {
                    for (let k = 0; k < this.setting.resolutions.length; k++) {
                        config.model = null;
                        config.width = parseInt(this.setting.resolutions[k].split("X")[0]);
                        config.height = parseInt(this.setting.resolutions[k].split("X")[1]);
                        config.path = this.setting.savePath;
                        config.fileName = this.setting.resolutions[k] + '-' + this.setting.settingName + '.jpg';
                        await screenShot(config);
                    }
                }
                this.setting.webSites[i].status = 'finished';
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
