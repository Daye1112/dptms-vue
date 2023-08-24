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

export function fileDownload(fileId, fileName) {
  let a = document.createElement('a')
  a.download = fileName
  a.style.display = 'none'
  a.href = baseApi + '/file-manage/file/download' + '?fileId=' + fileId;
  document.body.appendChild(a)
  // 触发点击
  a.click()
  // 然后移除
  document.body.removeChild(a)
}

export function fileDownloadBlob(data, fileName) {
  let url = window.URL.createObjectURL(new Blob([data]));
  let a = document.createElement('a')
  a.download = fileName
  a.style.display = 'none'
  a.href = url
  document.body.appendChild(a)
  // 触发点击
  a.click();
  window.URL.revokeObjectURL(a.href);
  // 然后移除
  document.body.removeChild(a)
}

/**
 * 获取文件预览地址
 * @param fileId 文件id
 */
export function fileView(fileId) {
  window.open(
    baseApi + '/file-manage/file/view?fileId=' + fileId,
    '_blank'
  );
  // return baseApi + "/file-manage/file/view?fileId=" + fileId;
}
