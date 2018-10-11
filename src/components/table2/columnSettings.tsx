import * as React from "react"

import { Arrows, ColumnSettingsContainer, Icon } from "./components"

import arrow from "../../lib/assets/images/icon-arrow.png"
import arrowColored from "../../lib/assets/images/icon-arrow-colored.png"
import hide from "../../lib/assets/images/icon-hide.png"
import move from "../../lib/assets/images/icon-switch.png"
import moveColored from "../../lib/assets/images/icon-switch-colored.png"

import { Sort } from "./"

interface Props {
  header: string
  hide: (header: string) => void
  move: (header: string) => void
  sortBy: (header: string, ascending: boolean) => void
  highlightMove: boolean
  sort: Sort
}

class ColumnSettings extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props)
    this.state = {}
  }

  public render() {
    const { header, highlightMove, sort } = this.props

    return (
      <div>
        <ColumnSettingsContainer>
          <Arrows>
            <Icon
              position={"absolute"}
              small={true}
              flipVertical={true}
              src={
                sort.header === header && !sort.ascending ? arrowColored : arrow
              }
              onClick={() => this.props.sortBy(header, false)}
            />
            <Icon
              position={"absolute"}
              bottom={0}
              small={true}
              src={
                sort.header === header && sort.ascending ? arrowColored : arrow
              }
              onClick={() => this.props.sortBy(header, true)}
            />
          </Arrows>
          <Icon onClick={() => this.props.hide(header)} src={hide} />
          <Icon
            onClick={() => this.props.move(header)}
            src={highlightMove ? moveColored : move}
          />
        </ColumnSettingsContainer>
      </div>
    )
  }
}

export default ColumnSettings
