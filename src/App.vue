<template>
  <v-app light>
    <v-toolbar app dark color="primary">
      <v-toolbar-title>Vuetify Upload Example</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        flat
        target="_blank"
        href="https://github.com/emjimadhu/vuetifyjs-upload"
      >
        github
    </v-btn>
    </v-toolbar>
    <v-content>
      <v-slide-y-transition mode="out-in">
        <v-container fluid>
          <v-layout row wrap>
            <v-flex xs12 sm10 md11 class="text-xs-center text-md-center">
              <v-text-field
                label="Select File"
                @click="pickFile"
                v-model='file.name'
                prepend-icon='attach_file'
                :disabled="uploadState"
              />
              <input
                type="file"
                style="display: none"
                ref="fileInput"
                :accept="fileType"
                @change="onFilePicked"
              >
            </v-flex>
            <v-flex xs12 sm1 md1 class="text-xs-center text-md-center">
              <v-btn
                color="primary"
                @click="uploadFile"
                :disabled="uploadState"
              >
                upload
              </v-btn>
            </v-flex>
          </v-layout>
          <v-layout row v-if="error.state">
            <v-flex xs12>
              <v-alert type="error" :value="error.state">
                {{ error.msg }}
              </v-alert>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12>
              <v-expansion-panel>
                <v-expansion-panel-content>
                  <div slot="header">Settings</div>
                  <v-card>
                    <v-card-text>
                      <v-subheader>Response Type</v-subheader>
                      <v-radio-group v-model="responseType" row>
                        <v-radio label="Success" value="success" ></v-radio>
                        <v-radio label="Error" value="error"></v-radio>
                      </v-radio-group>
                    </v-card-text>
                  </v-card>
                  <v-card>
                    <v-card-text>
                      <v-subheader>File Type</v-subheader>
                      <v-radio-group v-model="fileType" row>
                        <v-radio label="Images" value="image/*" ></v-radio>
                        <v-radio label="Videos" value="video/*"></v-radio>
                        <v-radio label="Audios" value="audio/*"></v-radio>
                      </v-radio-group>
                    </v-card-text>
                  </v-card>
                  <v-card>
                    <v-card-text>
                      <v-subheader>File Size</v-subheader>
                      <v-radio-group v-model="fileSize" row>
                        <v-radio label="0.5 MB" value="524288" ></v-radio>
                        <v-radio label="1 MB" value="1048576"></v-radio>
                        <v-radio label="1.5 MB" value="1572864"></v-radio>
                      </v-radio-group>
                    </v-card-text>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12>
              <v-list two-line subheader>
                <v-subheader inset>Files</v-subheader>
                <v-list-tile
                  avatar
                  v-if="hasFiles"
                  v-for="(file, index) in files"
                  :key="index"
                >
                  <v-list-tile-avatar>
                    <v-icon :class="[file.iconClass]">{{ file.icon }}</v-icon>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ file.title }}</v-list-tile-title>
                    <v-list-tile-sub-title>
                      <v-progress-linear v-if="file.uploadState" :indeterminate="true" />
                      <p v-if="!file.uploadState">{{ file.subtitle }}</p>
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <v-btn icon ripple color="red" small dark @click="deleteFile(index)">
                      <v-icon>close</v-icon>
                    </v-btn>
                  </v-list-tile-action>
                </v-list-tile>
                <v-list-tile v-if="!hasFiles" avatar>
                  <v-list-tile-avatar>
                    <v-icon class="grey white--text">priority_high</v-icon>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title>No Files Found.</v-list-tile-title>
                    <v-list-tile-sub-title>Please Upload some files.</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-flex>
          </v-layout>
        </v-container>
      </v-slide-y-transition>
    </v-content>
  </v-app>
</template>

<script>
  export default {
    name: 'vuetifyjs-upload',
    computed: {
      hasFiles: {
        get () {
          if (this.files.length > 0) {
            return true
          } else {
            return false
          }
        },
        set (v) {
          return v
        }
      }
    },
    data: () => ({
      file: {
        name: '',
        url: '',
        extension: '',
        file: ''
      },
      uploadState: false,
      files: [],
      error: {
        state: false,
        msg: ''
      },
      responseType: 'success',
      fileType: 'image/*',
      fileSize: '524288'
    }),
    methods: {
      pickFile () {
        this.alert()
        this.$refs.fileInput.click()
      },
      onFilePicked (e) {
        const selectedFiles = e.target.files
        if (selectedFiles[0]) {
          if (selectedFiles[0].size >= this.fileSize) {
            this.alert(true, `File is too big. ${selectedFiles[0].size} Bytes`)
          } else {
            this.file.name = selectedFiles[0].name
            this.file.extension = this.file.name.substr(this.file.name.indexOf('.') + 1)
            if (this.file.name.lastIndexOf('.') <= 0) {
              return
            }
            const fr = new FileReader()
            fr.readAsDataURL(selectedFiles[0])
            fr.addEventListener('load', () => {
              this.file.url = fr.result
              this.file.file = selectedFiles[0]
            })
          }
        } else {
          this.defaults()
        }
      },
      uploadFile () {
        this.uploadState = !this.uploadState

        if (this.file.extension) {
          this.hasFiles = true
          this.alert()
          this.files.unshift({
            icon: 'cloud_upload',
            iconClass: 'cyan lighten-1 white--text',
            title: this.file.name,
            uploadState: true,
            subtitle: 'Jan 9, 2014'
          })

          setTimeout(() => {
            this.defaults()
            this.uploadState = !this.uploadState
            this.files[0].uploadState = false
            setTimeout(() => {
              if (this.fileType === 'image/*') {
                this.files[0].icon = 'insert_photo'
              } else if (this.fileType === 'video/*') {
                this.files[0].icon = 'videocam'
              } else if (this.fileType === 'audio/*') {
                this.files[0].icon = 'audiotrack'
              }
            }, 1000)
            if (this.responseType === 'success') {
              this.files[0].icon = 'done'
              this.files[0].iconClass = 'green lighten-1 white--text'
              const currentDate = new Date()
              this.files[0].subtitle = currentDate.toISOString()
            } else {
              this.files[0].icon = 'close'
              this.files[0].iconClass = 'red lighten-1 white--text'
              this.files[0].subtitle = 'Error when uploading File.'
            }
            this.files[0].file = this.file.file
          }, 1000)
        } else {
          this.uploadState = !this.uploadState
          this.defaults()
          this.alert(true, 'Please select a File.')
        }
      },
      deleteFile (index) {
        this.files.splice(index, 1)
      },
      defaults () {
        this.file.name = ''
        this.file.file = ''
        this.file.url = ''
        this.file.extension = ''
      },
      alert (boolean, msg) {
        this.error.state = boolean || false
        this.error.msg = msg || ''
      }
    }
  }
</script>
