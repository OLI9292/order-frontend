import * as React from "react"

import { Arrows, ColumnSettingsContainer, Icon } from "./components"

import arrow from "../../lib/assets/images/icon-arrow.png"
import arrowColored from "../../lib/assets/images/icon-arrow-colored.png"
import hide from "../../lib/assets/images/icon-hide.png"
import move from "../../lib/assets/images/icon-switch.png"
import moveColored from "../../lib/assets/images/icon-switch-colored.png"
import filter from "../../lib/assets/images/icon-filter.png"
import filterColored from "../../lib/assets/images/icon-filter-colored.png"

import { Sort } from "./"

interface Props {
  header: string
  hide: (header: string) => void
  move: (header: string) => void
  sortBy: (header: string, ascending: boolean) => void
  highlightMove: boolean
  isHoveringHeader?: string
  sort: Sort
  filter: (header: string) => void
  filters: any
}

class ColumnSettings extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props)
    this.state = {}
  }

  public render() {
    const {
      header,
      highlightMove,
      sort,
      isHoveringHeader,
      filters
    } = this.props

    const isSorting = sort.header === header
    const isHovering = header === isHoveringHeader
    const isFiltering = filters[header] !== undefined

    return (
      <ColumnSettingsContainer>
        <Arrows>
          <Icon
            hide={!isSorting && !isHovering}
            position={"absolute"}
            small={true}
            flipVertical={true}
            src={isSorting && !sort.ascending ? arrowColored : arrow}
            onClick={() => this.props.sortBy(header, false)}
          />
          <Icon
            hide={!isSorting && !isHovering}
            position={"absolute"}
            bottom={0}
            small={true}
            src={isSorting && sort.ascending ? arrowColored : arrow}
            onClick={() => this.props.sortBy(header, true)}
          />
        </Arrows>
        <Icon
          hide={!isHovering}
          onClick={() => this.props.hide(header)}
          src={hide}
        />
        <Icon
          hide={!isHovering && !highlightMove}
          onClick={() => this.props.move(header)}
          src={highlightMove ? moveColored : move}
        />
        <Icon
          hide={!isHovering && !isFiltering}
          onClick={() => this.props.filter(header)}
          src={isFiltering ? filterColored : filter}
        />
      </ColumnSettingsContainer>
    )
  }
}

export default ColumnSettings
