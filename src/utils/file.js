import request from "./request"

const baseApi = process.env.VUE_APP_BASE_API;

/**
 * 文件上传
 * @param file
 */
export function fileUpload(file) {
  return new Promise((resolve, reject) => {
    // 上传文件
    let params = new FormData()
    params.append('file', file, file.name);
    request.upload("/file-manage/file/uploadFile", params)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function fileDownload(fileId) {
}

/**
 * 获取文件预览地址
 * @param fileId 文件id
 */
export function fileView(fileId) {
  return baseApi + "/file-manage/file/view?fileId=" + fileId;
}
