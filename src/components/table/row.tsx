import * as React from "react"
import * as moment from "moment"

import { isBoolean, includes } from "lodash"
import { Cell, Row, RowInput, Form } from "./components"

interface Props {
  visibleHeaders: string[]
  rowIdx: number
  data: any
  isEditing: string
  holdingShift: boolean
  editableFields: string[]
  unselectAllRows: () => void
  selectedRow: (i: number, selected: boolean) => void
  editRow: (key: string) => void
  updated?: (rowIdx: number, header: string, newValue: string) => void
}

interface State {
  newValue: string
  isSelected: boolean
}

const parsedValue = (v: any, header: string): string => {
  if (isBoolean(v)) {
    return String(v)
  } else if (header === "trade_date") {
    const t = moment(v, "x")
    return t.isValid() ? t.format("M/D/YY H:mm") : v
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
      <Row selected={isSelected}>
        {visibleHeaders.map((k: string) => (
          <Cell
            key={k}
            holdingShift={holdingShift}
            onClick={() => {
              if (holdingShift) {
                this.setState({ isSelected: !isSelected }, () =>
                  this.props.selectedRow(rowIdx, !isSelected)
                )
              } else if (includes(editableFields, k)) {
                this.props.editRow(`${rowIdx}-${k}`)
              } else {
                this.props.unselectAllRows()
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