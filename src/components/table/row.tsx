import * as React from "react"
import { isBoolean, includes } from "lodash"

import { Cell, Row, RowInput, CellForm, CopyIcon } from "./components"

import copy from "../../lib/assets/images/icon-copy.png"

import { parseDateString } from "../../lib/helpers"

interface Props {
  visibleHeaders: string[]
  rowIdx: number
  data: any
  isEditing: string
  holdingShift: boolean
  editableFields: string[]
  editRow: (key: string) => void
  updated?: (rowIdx: number, header: string, newValue: string) => void
  deselectCount: number
  selectedAllCount: number
  selectedRow: (rowIdx: number) => void
}

interface State {
  newValue: string
  isSelected: boolean
  isHovering: boolean
}

const parsedValue = (v: any, header: string): string => {
  if (isBoolean(v)) {
    return String(v)
  } else if (includes(["trade_date", "created_at"], header)) {
    return parseDateString(v)
  }
  return v
}

class RowComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      newValue: "",
      isSelected: false,
      isHovering: false
    }
  }

  public componentWillReceiveProps(nextProps: Props) {
    const { selectedAllCount, deselectCount } = this.props
    const { isSelected } = this.state
    if (deselectCount < nextProps.deselectCount && isSelected) {
      this.setState({ isSelected: false })
    } else if (selectedAllCount < nextProps.selectedAllCount && !isSelected) {
      this.setState({ isSelected: true })
    }
  }

  public clickedCopy() {
    const { data, visibleHeaders } = this.props
    const information = visibleHeaders
      .map((k: string) => parsedValue(data[k], k))
      .join(",")
    const copyHelper = document.createElement("input")
    copyHelper.className = "copyHelper"
    document.body.appendChild(copyHelper)
    copyHelper.value = information
    copyHelper.select()
    document.execCommand("copy")
    document.body.removeChild(copyHelper)
  }

  public render() {
    const { newValue, isSelected, isHovering } = this.state

    const {
      visibleHeaders,
      rowIdx,
      data,
      editableFields,
      isEditing,
      holdingShift,
      updated
    } = this.props

    const input = (header: string) => (
      <CellForm
        onSubmit={e => {
          e.preventDefault()
          if (updated) {
            updated(rowIdx, header, newValue)
          }
        }}
      >
        <RowInput
          onChange={e => this.setState({ newValue: e.target.value })}
          value={newValue}
          autoFocus={true}
        />
      </CellForm>
    )

    return (
      <Row
        onMouseEnter={() => this.setState({ isHovering: true })}
        onMouseLeave={() => this.setState({ isHovering: false })}
        className={`row${isSelected ? " selected" : ""}`}
        selected={isSelected}
      >
        <Cell white={true} holdingShift={holdingShift} editable={false}>
          <CopyIcon
            onClick={this.clickedCopy.bind(this)}
            hide={!isHovering}
            src={copy}
          />
        </Cell>
        {visibleHeaders.map((k: string) => (
          <Cell
            key={`${k}-${rowIdx}`}
            holdingShift={holdingShift}
            onClick={e => {
              if (includes(editableFields, k)) {
                this.props.editRow(`${rowIdx}-${k}`)
              } else {
                this.setState({ isSelected: !isSelected }, () =>
                  this.props.selectedRow(rowIdx)
                )
              }
            }}
            editable={includes(editableFields, k)}
          >
            {isEditing === `${rowIdx}-${k}`
              ? input(k)
              : parsedValue(data[k], k)}
          </Cell>
        ))}
      </Row>
    )
  }
}

export default RowComponent
