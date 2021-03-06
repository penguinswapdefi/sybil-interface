import React from 'react'
import styled from 'styled-components'
import { ProposalData, useActiveProtocol, useAllProposalStates } from '../../state/governance/hooks'
import { EmptyProposals, ProposalStatus, ProposalStatusSmall } from './styled'
import { TYPE, OnlyAboveSmall, OnlyBelowSmall } from '../../theme'
import { GreyCard } from '../Card'
import Row, { RowBetween, RowFixed } from '../Row'
import { AutoColumn } from '../Column'
import { Link } from 'react-router-dom'
import Loader from '../Loader'
import { enumerateProposalState } from '../../data/governance'

const Wrapper = styled.div<{ backgroundColor?: string }>`
  width: 100%;
`

const ProposalItem = styled.div`
  border-radius: 12px;
  padding: 1rem;
  background-color: ${({ theme }) => theme.bg1};
  text-decoration: none;

  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`

export default function ProposalList({ allProposals }: { allProposals: { [id: string]: ProposalData } | undefined }) {
  const [activeProtocol] = useActiveProtocol()

  // used for displaying states
  /**
   * @TODO update this to be in one list
   */
  const allStatuses = useAllProposalStates()

  return (
    <Wrapper>
      <GreyCard>
        {allProposals && Object.keys(allProposals)?.length === 0 && (
          <EmptyProposals>
            <TYPE.body style={{ marginBottom: '8px' }}>No proposals found.</TYPE.body>
            <TYPE.subHeader>
              <i>Proposals submitted by community members will appear here.</i>
            </TYPE.subHeader>
          </EmptyProposals>
        )}
        <AutoColumn gap="1rem">
          {allStatuses && allProposals ? (
            Object.values(allProposals)
              .reverse()
              .map((p: ProposalData, i) => {
                const index = parseInt(p.id) - 1 // offset based on reverse index
                const status = allStatuses[index]
                  ? enumerateProposalState(allStatuses[index])
                  : enumerateProposalState(0)
                return (
                  <ProposalItem key={i} as={Link} to={activeProtocol?.id + '/' + p.id}>
                    <RowBetween>
                      <RowFixed>
                        <OnlyAboveSmall>
                          <TYPE.black mr="8px">{p.id}</TYPE.black>
                        </OnlyAboveSmall>
                        <TYPE.black mr="10px">{p.title}</TYPE.black>
                      </RowFixed>
                      <OnlyBelowSmall>
                        {allStatuses?.[i] ? (
                          <ProposalStatusSmall status={status}>{status}</ProposalStatusSmall>
                        ) : (
                          <Loader />
                        )}
                      </OnlyBelowSmall>
                      <OnlyAboveSmall>
                        {allStatuses?.[i] ? <ProposalStatus status={status}>{status}</ProposalStatus> : <Loader />}
                      </OnlyAboveSmall>
                    </RowBetween>
                  </ProposalItem>
                )
              })
          ) : (
            <Row justify="center">
              <Loader />
            </Row>
          )}
        </AutoColumn>
      </GreyCard>
    </Wrapper>
  )
}
