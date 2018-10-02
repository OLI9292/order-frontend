import * as React from "react"

import Dropzone from "react-dropzone"

import { uploadFilledOrders } from "../../models/filledOrder"
import colors from "../../lib/colors"

const style = {
  width: "110px",
  height: "35px",
  border: `1px solid ${colors.grey}`,
  color: colors.darkGrey,
  borderRadius: "5px",
  lineHeight: "35px",
  "text-align": "center",
  fontFamily: "Source Sans Pro",
  cursor: "pointer",
  "box-sizing": "border-box"
}

class FileUpload extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {}
  }

  public async onDrop(acceptedFiles: File[], rejectedFiles: File[]) {
    const file = acceptedFiles[0]
    if (file) {
      const result = await uploadFilledOrders(file)
      console.log(result)
    }
  }

  public render() {
    return (
      <Dropzone style={style} accept={".csv"} onDrop={this.onDrop.bind(this)}>
        Upload File
      </Dropzone>
    )
  }
}

export default FileUpload
