import * as React from "react"

import { isBoolean, includes } from "lodash"
import { Cell, Row, RowInput, Form } from "./components"

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
  selectedRow: (rowIdx: number) => void
}

interface State {
  newValue: string
  isSelected: boolean
}

const parsedValue = (v: any, header: string): string => {
  if (isBoolean(v)) {
    return String(v)
  } else if (header === "trade_date") {
    return parseDateString(v)
  }
  return v
}

class RowComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      newValue: "",
      isSelected: false
    }
  }

  public componentWillReceiveProps(nextProps: Props) {
    if (
      this.props.deselectCount < nextProps.deselectCount &&
      this.state.isSelected
    ) {
      this.setState({ isSelected: false })
    }
  }

  public render() {
    const { newValue, isSelected } = this.state

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
      <Form
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
      </Form>
    )

    return (
      <Row
        className={`row${isSelected ? " selected" : ""}`}
        selected={isSelected}
      >
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
