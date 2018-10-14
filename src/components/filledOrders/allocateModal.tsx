import * as React from "react"
import { without, values, sum, pick } from "lodash"

import { Modal, DimOverlay, ModalError } from "../common/modal"
import Header from "../common/header"
import Text from "../common/text"
import FlexedDiv from "../common/flexedDiv"
import { AllocateButton, Divider } from "./components"
import colors from "../../lib/colors"

import { FilledOrder, BuySell } from "../../models/filledOrder"
import calulate, { Allocation } from "./calculate"

export interface OrdersForAllocation {
  filledOrders: FilledOrder[]
  direction: BuySell
  instrument: string
  total: number
}

interface Props {
  error?: string
  clients: string[]
  closeModal: () => void
  ordersForAllocation: OrdersForAllocation
  allocate: (ids: string[], data: any) => void
}

interface State {
  error?: string
  selectedClients: string[]
  model?: Model
  quantities: any
  summary: string[]
  allocations?: Allocation[]
}

export enum Model {
  sequential = "sequential",
  average = "average"
}

class AllocateModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      error: this.props.error,
      selectedClients: [],
      quantities: {},
      summary: []
    }
  }

  public editedQuantity(quantity: string, client: string) {
    const { quantities } = this.state
    quantities[client] = quantity
    this.setState({ quantities }, this.calulate)
  }

  public editedModel(model: Model) {
    this.setState({ model }, this.calulate)
  }

  public calulate() {
    const { quantities, selectedClients, model } = this.state
    const { ordersForAllocation, clients } = this.props

    clients.forEach(c => {
      if (selectedClients.indexOf(c) > -1) {
        quantities[c] = this.state.quantities[c]
      } else {
        delete quantities[c]
      }
    })

    const allocations =
      model !== undefined || selectedClients.length === 1
        ? calulate(
            clients,
            selectedClients,
            quantities,
            ordersForAllocation,
            model
          )
        : undefined

    const summary = (allocations || []).map(
      a => `Allocate ${a.quantity || "________"} to ${a.client} at $${a.price}.`
    )

    this.setState({
      summary,
      quantities,
      allocations
    })
  }

  public allocate() {
    const { selectedClients, model, allocations } = this.state
    const {
      total,
      instrument,
      direction,
      filledOrders
    } = this.props.ordersForAllocation

    const quantities = allocations ? allocations.map(a => a.quantity) : []

    let error

    if (selectedClients.length === 0) {
      error = "At least 1 client must be selected."
    } else if (selectedClients.length > 1) {
      if (model === undefined) {
        error = "Model must be selected."
      } else if (values(quantities).some(q => !Number(q))) {
        error = "Quanties must be a float or integer."
      } else if (sum(values(quantities)) !== total) {
        error = `Sum of quanties must equal ${total}.`
      }
    }

    if (error) {
      this.setState({ error })
    } else if (allocations) {
      const ids = filledOrders.map(f => f.id)
      const data = {
        quantity: sum(quantities),
        allocation_type: model || "single client",
        external_symbol: instrument,
        buy_sell: direction,
        allocations: allocations.map(a =>
          pick(a, ["price", "quantity", "client"])
        )
      }
      this.props.allocate(ids, data)
    }
  }

  public render() {
    const { selectedClients, model, quantities, error, summary } = this.state
    const { clients, ordersForAllocation } = this.props
    const { direction, instrument, total } = ordersForAllocation

    const MULTIPLE = selectedClients.length > 1

    const clientOption = (
      <div>
        <div>
          <Text.m display="inline-block" margin="0 10px 0 0">
            Client(s) :
          </Text.m>
          {selectedClients.map((s, i) => (
            <Text.s
              display="inline-block"
              margin="0 5px 0 0"
              clickable={true}
              color={colors.blue}
              hoverColor={colors.red}
              onClick={() =>
                this.setState(
                  { selectedClients: without(selectedClients, s) },
                  this.calulate
                )
              }
              key={i}
            >
              {s}
            </Text.s>
          ))}
        </div>
        <FlexedDiv height="30px" margin="15px 0 0 20px">
          {without(clients, ...selectedClients).map((s, i) => (
            <Text.s
              margin="0 5px"
              clickable={true}
              hoverColor={colors.blue}
              onClick={() =>
                this.setState(
                  { selectedClients: selectedClients.concat(s) },
                  this.calulate
                )
              }
              key={i}
            >
              {s}
            </Text.s>
          ))}
        </FlexedDiv>
      </div>
    )

    const modelOption = (
      <FlexedDiv margin="0">
        <Text.m margin="0 15px 0 0">Model :</Text.m>
        <input
          type="checkbox"
          checked={model === Model.average}
          onChange={() => this.editedModel(Model.average)}
        />
        <Text.s margin="0 15px 0 4px">Average</Text.s>
        <input
          type="checkbox"
          checked={model === Model.sequential}
          onChange={() => this.editedModel(Model.sequential)}
        />
        <Text.s margin="0 0 0 4px">Sequential</Text.s>
      </FlexedDiv>
    )

    const quantityOption = (
      <div>
        <Text.m>Quantities :</Text.m>
        {selectedClients.map((c, i) => (
          <FlexedDiv margin="0 0 0 20px" key={i}>
            <Text.s margin="5px 5px 5px 0">{c}</Text.s>
            <input
              type="text"
              value={quantities[c] || ""}
              onChange={e => this.editedQuantity(e.target.value, c)}
            />
          </FlexedDiv>
        ))}
      </div>
    )

    return (
      <div>
        <DimOverlay onClick={this.props.closeModal.bind(this)} />
        <Modal>
          <Header.ms margin="0 0 20px 0">
            {`Allocating ${total} ${
              direction === BuySell.B ? "buy" : "sell"
            } ${instrument}`}
          </Header.ms>

          {clientOption}

          {MULTIPLE && (
            <div>
              <Divider />
              {modelOption}
              <Divider />
              {quantityOption}
            </div>
          )}

          <Divider />
          <Header.s textAlign="center">Summary</Header.s>
          {summary.map((s, i) => (
            <Text.s key={i}>{s}</Text.s>
          ))}

          <AllocateButton onClick={this.allocate.bind(this)}>
            Allocate
          </AllocateButton>

          <ModalError>{error}</ModalError>
        </Modal>
      </div>
    )
  }
}

export default AllocateModal
