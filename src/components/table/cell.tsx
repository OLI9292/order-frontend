import * as React from "react"
import * as moment from "moment"

import { Cell, RowInput, Form } from "./components"

interface Props {
  rowIdx: number
  value: any
  isEditable: boolean
  isEditing: string
  holdingShift: boolean
  selectedRow: (i: number) => void
  editRow: (key: string) => void
  header: string
  updated: (rowIdx: number, header: string, newValue: string) => void
  unselectAllRows: () => void
}

interface State {
  newValue: string
}

class CellComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      newValue: ""
    }
  }

  public render() {
    const { newValue } = this.state

    const {
      rowIdx,
      value,
      isEditable,
      isEditing,
      holdingShift,
      header
    } = this.props

    const key = `${header}-${rowIdx}`

    const parsedValue = (str: string): string => {
      const isDate = header === "trade_date"
      if (isDate) {
        const t = moment(str, "x")
        return t.isValid() ? t.format("M/D/YY H:mm") : str
      }
      return str
    }

    const input = (
      <Form
        onSubmit={e => {
          e.preventDefault()
          this.props.updated(rowIdx, header, newValue)
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
      <Cell
        holdingShift={holdingShift}
        onClick={() => {
          if (holdingShift) {
            this.props.selectedRow(rowIdx)
          } else if (isEditable) {
            this.props.editRow(key)
          } else {
            this.props.unselectAllRows()
          }
        }}
        editable={isEditable}
      >
        {isEditing === key ? input : parsedValue(value)}
      </Cell>
    )
  }
}

export default CellComponent
