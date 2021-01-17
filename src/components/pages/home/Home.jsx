import React, { Fragment, useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { Container } from 'react-bootstrap'
import styled from 'styled-components'
import Strategies from '../../organisms/strategies'
import OptionsList from '../../organisms/optionsList'
import { Row, Col } from 'react-bootstrap'
import SmartAccountsCard from '../../organisms/smartAccountsCard'
import Button from '../../atoms/button'
import Banner from '../../atoms/banner'
import Icon from '../../atoms/icon'

const MainContainer = styled(Container)`
  max-width: 2500px !important;
  padding-top: 20px;
`

const ConnectButton = styled(Button)`
  width: 100%;
`

const DisconnectButton = styled(Button)`
  width: 100%;
`

const ExecuteButton = styled(Button)`
  width: 100%;
`

const NewStrategyButton = styled(Button)`
  width: 100%;
`

const StrategiesContainer = styled.div`
  width: 100%;
  overflow: auto;
`

const BannerText = styled.span`
  margin-left: 5px;
`

const Home = ({
  buildAndExecute,
  isConnected,
  address,
  onConnectWallet,
  onDisconnectWallet,
  smartAccount,
  onNewStrategy
}) => {
  const [showBanner, setShowBanner] = useState(true)
  const onCloseBanner = useCallback(() => {
    setShowBanner(!showBanner)
  }, [showBanner])

  return (
    <Fragment>
      <MainContainer>
        <Row>
          <Col xs={12} lg={8} xl={10}>
            <StrategiesContainer>
              <Strategies />
            </StrategiesContainer>
          </Col>
          <Col xs={12} lg={4} xl={2}>
            <Row className="mt-2 font-weight-bold">
              <Col xs={12}>
                {isConnected ? (
                  <Fragment>
                    <DisconnectButton onClick={onDisconnectWallet} text={`Disconnect (${address})`} />
                  </Fragment>
                ) : (
                  <React.Fragment>
                    <ConnectButton onClick={onConnectWallet} text={'Connect'} />
                  </React.Fragment>
                )}
              </Col>
            </Row>
            <Row className="mt-2 font-weight-bold">
              <Col xs={12}>
                <ExecuteButton onClick={buildAndExecute} text={'Execute'} disabled={!isConnected || !smartAccount} />
              </Col>
            </Row>
            <Row className="mt-2 font-weight-bold">
              <Col xs={12}>
                <NewStrategyButton onClick={onNewStrategy} text={'New strategy'} />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col xs={12}>
                <SmartAccountsCard />
              </Col>
            </Row>
            <Row className="mt-2 font-weight-bold">
              <Col xs={12}>
                <OptionsList />
              </Col>
            </Row>
          </Col>
        </Row>
      </MainContainer>
      <Banner visible={showBanner} onClose={onCloseBanner}>
        <Fragment>
          <Icon icon="caution" />
          <BannerText>The project is still in the beta phase. Use it with caution!</BannerText>
        </Fragment>
      </Banner>
    </Fragment>
  )
}

Home.propTypes = {
  buildAndExecute: PropTypes.func,
  selectedPage: PropTypes.string,
  onConnectWallet: PropTypes.func,
  onDisconnectWallet: PropTypes.func,
  isConnected: PropTypes.bool,
  smartAccount: PropTypes.object,
  onNewStrategy: PropTypes.func
}

export default Home
