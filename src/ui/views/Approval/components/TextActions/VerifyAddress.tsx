import React from 'react';
import styled from 'styled-components';
import { VerifyAddressAction } from '@debank/rabby-api/dist/types';
import { Col, Row, Table } from '../Actions/components/Table';
import * as Values from '../Actions/components/Values';
import { Result } from '@rabby-wallet/rabby-security-engine';

const Wrapper = styled.div``;

const VerifyAddress = ({
  data,
}: {
  data: VerifyAddressAction;
  engineResults: Result[];
}) => {
  return (
    <Wrapper>
      <Table>
        <Col>
          <Row isTitle>Interact Dapp</Row>
          <Row>
            <Values.Protocol value={data.protocol} />
          </Row>
        </Col>
        <Col>
          <Row isTitle>Description</Row>
          <Row>{data.desc}</Row>
        </Col>
      </Table>
    </Wrapper>
  );
};

export default VerifyAddress;
