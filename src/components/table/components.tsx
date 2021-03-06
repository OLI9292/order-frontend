import styled from "styled-components"

import colors from "../../lib/colors"
import FlexedDiv from "../common/flexedDiv"

export const Container = styled.div`
  width: 100%;
  padding: 5px;
  box-sizing: border-box;
  border: 1px solid ${colors.grey};
`

export const TableContainer = styled.div`
  overflow: auto;
  width: 100%;
  height: 60vh;
  margin: 0 auto;
`

export const Table = styled.table`
  font-family: Source Sans Pro;
  border-collapse: collapse;
  font-size: 14px;
  text-align: left;
`

export const HeaderRow = styled.tr`
  height: 50px;
`

interface TableHeaderProps {
  slim?: boolean
}

export const TableHeader = styled.th`
  border-bottom: 1px solid ${colors.grey};
  border-top: 1px solid ${colors.grey};
  padding: 0px 5px;
  min-width: ${(p: TableHeaderProps) => (p.slim ? "10px" : "65px")};
  position: relative;
  padding-bottom: 15px;
  font-weight: 400;
`

interface CellProps {
  holdingShift: boolean
  editable: boolean
  white?: boolean
}

export const Cell = styled.td`
  background-color: ${(p: CellProps) => p.white && "white !important"};
  white-space: nowrap;
  padding: 0px 10px;
  cursor: ${(p: CellProps) =>
    p.holdingShift ? "pointer" : p.editable && "text"};
  &:hover {
    background-color: ${(p: CellProps) => p.editable && "white"};
  }
`

interface IconProps {
  flipVertical?: boolean
  small?: boolean
  position?: string
  bottom?: number
  hide: boolean
}

export const Icon = styled.img`
  height: ${(p: IconProps) => (p.small ? "12px" : "16px")};
  width: ${(p: IconProps) => (p.small ? "12px" : "16px")};
  transform: ${(p: IconProps) => (p.flipVertical ? "rotateX(180deg)" : "")};
  position: ${(p: IconProps) => p.position};
  bottom: ${(p: IconProps) => p.bottom};
  cursor: pointer;
  margin-right: 3px;
  opacity: ${(p: IconProps) => (p.hide ? 0 : 1)};
`

export const ColumnSettingsContainer = FlexedDiv.extend`
  bottom: 5px;
  height: 20px;
  position: absolute;
`

export const Arrows = styled.div`
  height: 20px;
  position: relative;
  width: 16px;
`

export const Span = styled.span`
  cursor: pointer;
  margin: 0px 5px;
`

interface RowProps {
  selected: boolean
}

export const Row = styled.tr`
  font-weight: 300;
  background-color: ${(p: RowProps) => (p.selected ? colors.blue : "white")};
  &:hover {
    background-color: ${(p: RowProps) =>
      p.selected ? colors.blue : colors.grey};
  }
`

export const RowInput = styled.input`
  width: 100%;
  height: 100%;
  outline: 0;
  border: 0;
  font-family: Source Sans Pro;
  font-size: 14px;
  padding: 0;
  font-weight: 300px;
`

export const CellForm = styled.form`
  width: 100%;
  height: 100%;
`

export const RowCountBox = styled.div`
  position: absolute;
  right: 20px;
  bottom: 20px;
  text-align: right;
`

export const DeselectSpan = styled.span`
  cursor: pointer;
  color: ${colors.red};
`

interface CopyIconProps {
  hide: boolean
}

export const CopyIcon = styled.img`
  opacity: ${(p: CopyIconProps) => (p.hide ? 0 : 1)};
  width: 15px;
  height: 15px;
  cursor: pointer;
  vertical-align: middle;
`
