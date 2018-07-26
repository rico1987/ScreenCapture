<template>
    <div class="dashboard-container">
        <el-row v-show="!showScanTable">
            <el-button plain size="mini" type="primary" @click="newSettings()">创建截屏配置</el-button>
        </el-row>
        <el-table :data="settings" style="width: 100%" v-show="!showScanTable">
            <el-table-column prop="settingName" label="配置名称" width="180">
            </el-table-column>
            <el-table-column prop="createTime" label="创建日期">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="startScan(scope.row)">开始截屏</el-button>
                    <el-button size="mini" @click="checkSetting(scope.$index)">查看配置</el-button>
                    <el-button size="mini" type="danger" @click="removeSetting(scope.$index)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="新建截屏配置" class="setting-dialog" :visible.sync="showSettingDialog" width="80%">
            <el-row>
                <el-form :inline="true" label-width="120px">
                    <el-form-item label="配置名称：">
                        <el-input type="text" size="mini" v-model="settingName" maxlength="20" />
                    </el-form-item>
                    <el-form-item label="图片保存地址：">
                        <el-button size="mini" @click="chooseSavePath()">选择</el-button>
                        <span>{{savePath}}</span>
                    </el-form-item>
                </el-form>
                <el-form label-width="120px">
                    <el-form-item label="截图分辨率：">
                        <el-checkbox-group v-model="resolutions">
                            <el-checkbox label="1920X1080"></el-checkbox>
                            <el-checkbox label="1280X800"></el-checkbox>
                            <el-checkbox label="1024X768"></el-checkbox>
                            <el-checkbox label="1366X768"></el-checkbox>
                            <el-checkbox label="375X812"></el-checkbox>
                            <el-checkbox label="414X736"></el-checkbox>
                            <el-checkbox label="768X1024"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="模拟设备型号：">
                        <el-checkbox-group v-model="models">
                            <el-checkbox label="iPhone 6"></el-checkbox>
                            <el-checkbox label="iPhone 6 Plus"></el-checkbox>
                            <el-checkbox label="iPhone 7"></el-checkbox>
                            <el-checkbox label="iPhone 7 Plus"></el-checkbox>
                            <el-checkbox label="iPhone 8"></el-checkbox>
                            <el-checkbox label="iPhone 8 Plus"></el-checkbox>
                            <el-checkbox label="iPhone SE"></el-checkbox>
                            <el-checkbox label="iPhone X"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="全页面截取：">
                        <el-checkbox-group v-model="fullScreenWidth">
                            <el-checkbox label="1800px"></el-checkbox>
                            <el-checkbox label="1080px"></el-checkbox>
                            <el-checkbox label="1024px"></el-checkbox>
                            <el-checkbox label="800px"></el-checkbox>
                            <el-checkbox label="414px"></el-checkbox>
                            <el-checkbox label="375px"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item>
                        <el-button style="float:right;" size="mini" type="primary" plain @click="addWebsite()">添加网站</el-button>
                    </el-form-item>
                </el-form>
            </el-row>
            <el-table :data="webSites" style="width: 100%">
                <el-table-column label="编号" type="index" width="50">
                </el-table-column>
                <el-table-column label="截图网址">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.url" size="mini" @blur="checkUrl(scope.$index)"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="moveUp(scope.$index)">上移</el-button>
                        <el-button size="mini" @click="moveDown(scope.$index)">下移</el-button>
                        <el-button size="mini" type="danger" @click="remove(scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showSettingDialog = false">取 消</el-button>
                <el-button size="small" type="primary" @click="saveSetting()">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="截屏配置详情" class="setting-dialog" :visible.sync="showSettingDetailDialog" v-if="settingDetail" width="80%">
            <el-row>
                <el-form label-width="120px" :inline="true">
                    <el-form-item label="配置名称：">
                        <el-input type="text" size="mini" v-model="settingDetail.settingName" disabled maxlength="20" />
                    </el-form-item>
                    <el-form-item label="图片保存地址:">
                        <el-input type="text" size="mini" v-model="settingDetail.savePath" disabled maxlength="20" />
                    </el-form-item>
                </el-form>
                <el-form label-width="120px">
                    <el-form-item label="截图分辨率：">
                        <el-tag v-bind:key="resolution" size="mini" style="margin-right: 5px;" v-for="resolution in settingDetail.resolutions">{{resolution}}</el-tag>
                    </el-form-item>
                    <el-form-item label="模拟设备型号:">
                        <el-tag v-bind:key="model" size="mini" style="margin-right: 5px;" v-for="model in settingDetail.models">{{model}}</el-tag>
                    </el-form-item>
                    <el-form-item label="模拟设备型号:">
                        <el-tag v-bind:key="width" size="mini" style="margin-right: 5px;" v-for="width in settingDetail.fullScreenWidth">{{width}}</el-tag>
                    </el-form-item>
                </el-form>
            </el-row>
            <el-table :data="settingDetail.webSites" style="width: 100%">
                <el-table-column label="截图网址">
                    <template slot-scope="scope">
                        {{scope.row.url}}
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="showSettingDetailDialog = false">确 定</el-button>
            </span>
        </el-dialog>
        <scanUrlTable ref="scan-url-table" v-show="showScanTable" v-if="selectedSetting" :setting="selectedSetting">
        </scanUrlTable>
        <el-row v-show="showScanTable">
            <el-button class="back-to-list-btn" size="mini" @click="showScanTable = false">返回配置列表</el-button>
        </el-row>
    </div>
</template>

<script>
import {
    getScanSettings,
    setScanSettings,
} from '@/utils/setting';
import { dialog } from '@/service/coreService';
import scanUrlTable from '@/components/scan/scanUrlTable';

export default {
    name: 'dashboard',
    components: {
        scanUrlTable,
    },
    directives: {
    },
    data() {
        return {
            settingName: '',
            settings: [],
            webSites: [],
            showSettingDialog: false,
            settingDetail: null,
            showSettingDetailDialog: false,
            resolutions: [],
            fullScreenWidth: [],
            models: [],
            selectedSetting: null,
            showScanTable: false,
            savePath: null,
        };
    },
    mounted() {
        const appConfig = getScanSettings();
        this.settings = appConfig.settings;
    },
    methods: {
        newSettings() {
            this.settingName = '';
            this.resolutions = [];
            this.webSites = [];
            this.showSettingDialog = true;
        },
        removeSetting(index) {
            this.settings.splice(index, 1);
            const appConfig = getScanSettings();
            appConfig.settings = this.settings.concat([]);
            setScanSettings(appConfig);
        },
        checkSetting(index) {
            this.settingDetail = this.settings[index];
            this.showSettingDetailDialog = true;
        },
        startScan(row) {
            this.selectedSetting = row;
            this.showScanTable = true;
            this.$nextTick(() => {
                this.$refs['scan-url-table'].startScan();
            })
        },
        addWebsite() {
            this.webSites.push({
                invalid: false,
            });
        },

        checkUrl(index) {
            // eslint-disable-next-line
            const urlReg = /^(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?$/;
            if (urlReg.test(this.webSites[index].url)) {
                this.webSites[index].invalid = false;
            } else {
                this.webSites[index].invalid = true;
            }
        },
        moveUp(index) {
            if (index === 0) return false;
            const temp = this.webSites[index - 1].url;
            this.webSites[index - 1].url = this.webSites[index].url;
            this.webSites[index].url = temp;
            return true;
        },
        moveDown(index) {
            if (index === this.webSites.length - 1) return false;
            const temp = this.webSites[index + 1].url;
            this.webSites[index + 1].url = this.webSites[index].url;
            this.webSites[index].url = temp;
            return true;
        },
        remove(index) {
            this.webSites.splice(index, 1);
        },
        saveSetting() {
            if (!this.settingName) {
                this.$message.error('请输入配置名称！');
                return false;
            }
            if (this.resolutions.length === 0 && this.models.length === 0 && this.fullScreenWidth.length === 0) {
                this.$message.error('请至少选择一个分辨率或者型号！');
                return false;
            }
            if (this.webSites.length === 0) {
                this.$message.error('请输入至少一个网站！');
                return false;
            }
            if (!this.savePath) {
                this.$message.error('请选择图片保存地址！');
                return false;
            }
            const scanSetting = {
                settingName: this.settingName,
                resolutions: this.resolutions,
                webSites: this.webSites,
                models: this.models,
                fullScreenWidth: this.fullScreenWidth,
                savePath: this.savePath,
                createTime: new Date(),
                scanTime: []
            };
            const appConfig = getScanSettings();
            appConfig.settings.push(scanSetting);
            this.settings = appConfig.settings;
            setScanSettings(appConfig);
            this.showSettingDialog = false;
            this.$message({
                message: '新建配置成功!',
                type: 'success',
            });
            return true;
        },

        chooseSavePath() {
            let paths = dialog.showOpenDialog({
                title: '请选择截图保存文件夹',
                buttonLabel: '选择文件夹',
                properties: ['openDirectory']
            });
            if (paths) {
                let path = paths[0]
                this.savePath = path
            } else {
                this.$message({
                message: '请选择保存文件夹!',
                type: 'error',
            });
            }
        },
    },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.setting-dialog{
    .el-table{
        max-height: 350px;
        overflow-y: auto;
    }
    .el-form-item{
        margin-bottom: 0;
    }
}
.el-checkbox+.el-checkbox{
    margin-left: 15px;
}
.back-to-list-btn{
    float: right;
    margin-top: 10px;
}
</style>
