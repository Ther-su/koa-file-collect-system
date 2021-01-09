self.importScripts('/spark-md5.min.js') // 导入脚本

// 生成文件 hash
self.onmessage = e => {
  // const { fileChunkList } = e.data
  // const spark = new self.SparkMD5.ArrayBuffer()
  // let percentage = 0
  // let count = 0
  // const loadNext = index => {
  //   const reader = new FileReader()
  //   reader.readAsArrayBuffer(fileChunkList[index].file)
  //   reader.onload = e => {
  //     count++
  //     spark.append(e.target.result)
  //     if (count === fileChunkList.length) {
  //       self.postMessage({
  //         percentage: 100,
  //         hash: spark.end()
  //       })
  //       self.close()
  //     } else {
  //       percentage += 100 / fileChunkList.length
  //       self.postMessage({
  //         percentage
  //       })
  //       loadNext(count)
  //     }
  //   }
  // }

  // loadNext(0)

  const { uploadFile } = e.data
  let percentage = 0
  const spark = new self.SparkMD5.ArrayBuffer()
  const reader = new FileReader()
  const size = uploadFile.size
  const offset = 2 * 1024 * 1024
  const chunks = [uploadFile.slice(0, offset)]
  // 前面100K

  let cur = offset
  while (cur < size) {
    // 最后一块全部加进来
    if (cur + offset >= size) {
      chunks.push(uploadFile.slice(cur, cur + offset))
    } else {
      // 中间的 前中后去两个子杰
      const mid = cur + offset / 2
      const end = cur + offset
      chunks.push(uploadFile.slice(cur, cur + 2))
      chunks.push(uploadFile.slice(mid, mid + 2))
      chunks.push(uploadFile.slice(end - 2, end))
    }
    // 前取两个子杰
    cur += offset
    percentage = cur > size ? 100 : parseInt(cur / size * 100).toFixed(0)
    self.postMessage({ percentage })
  }
  // 拼接
  reader.readAsArrayBuffer(new Blob(chunks))

  // 最后100K
  reader.onload = e => {
    spark.append(e.target.result)
    self.postMessage({
      percentage: 100,
      hash: spark.end()
    })
  }
}
