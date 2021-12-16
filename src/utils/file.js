import request from "./request"

const baseApi = process.env.VUE_APP_BASE_API;

/**
 * 文件上传
 * @param file 上传文件
 * @param processFun 进度处理
 */
export function fileUpload(file, processFun = null) {
  return new Promise((resolve, reject) => {
    // 上传文件
    let params = new FormData();
    params.append('file', file, file.name);
    request.upload("/file-manage/file/uploadFile", params, processFun)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
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
