import React from 'react'
import PropTypes from 'prop-types'
import { Container } from 'react-bootstrap'
import styled from 'styled-components'
import SelectedOptionsController from '../../organisms/selectedOptions'
import OptionsList from '../../organisms/optionsList'
import { Row, Col } from 'react-bootstrap'
import InfoCard from '../../atoms/InfoCard'

const Label = styled.div`
  font-weight: bold;
  font-size: 16px;
`

const Home = _props => {
  return (
    <Container>
      <Row className="mt-3">
        <Col xs={12}>
          <InfoCard />
        </Col>
      </Row>
      <Row className="mt-5 font-weight-bold">
        <Col xs={12} lg={4}>
          <Label>Options:</Label>
        </Col>
        <Col xs={12} lg={8}>
          <Label>Your current strategy:</Label>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col xs={12} lg={4}>
          <OptionsList />
        </Col>
        <Col xs={12} lg={8}>
          <SelectedOptionsController />
        </Col>
      </Row>
    </Container>
  )
}

Home.propTypes = {}

export default Home
