devServer: {
  // hot: true,
  // inline: false,
  port: 1000,
  disableHostCheck: true,
  proxy: {
    "/services": "http://sbxops.sbx.avtr.net",
    "/wiki": "http://sbxops.sbx.avtr.net",
  }
},
