import * as React from "react"

import Dropzone from "react-dropzone"

import { FilledOrder, uploadFilledOrders } from "../../models/filledOrder"
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

interface Props {
  uploadedFilledOrders: (filledOrders: FilledOrder[]) => void
  setError: (error?: string) => void
}

class FileUpload extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props)
  }

  public async onDrop(acceptedFiles: File[], rejectedFiles: File[]) {
    const file = acceptedFiles[0]
    if (file) {
      const fd = new FormData()
      fd.append("file", file)
      const result = await uploadFilledOrders(fd)
      if (result instanceof Error) {
        this.props.setError(result.message)
      } else {
        this.props.uploadedFilledOrders(result)
      }
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
