/**
 * Copyright 2023-present Mesh Connect, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useEffect, useState, useContext } from 'react';
import { PortalContext } from '../context/PortalContext';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TableFooter,
  TablePagination,
  Typography,
  Paper,
  CircularProgress,
} from '@mui/material';

function TransactionsDashboard() {
  const { portalInstance, chain } = useContext(PortalContext);
  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [showTransactionsTable, setShowTransactionsTable] = useState(false);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const getTransactions = async () => {
      try {
        setLoadingTransactions(true);
        const fetchTransactions = await portalInstance.getTransactions();

        setTransactions(fetchTransactions);
      } catch (error) {
        console.log('error', error);
      } finally {
        setLoadingTransactions(false);
      }
    };

    getTransactions();
  }, [chain]);

  if (loadingTransactions) {
    return <CircularProgress />;
  }

  const renderTable = (rows, headers) => {
    const rowsPerPage = 10;

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const currentPageTransactions = rows.slice(
      page * rowsPerPage,
      (page + 1) * rowsPerPage
    );

    return (
      <div style={{ overflowX: 'auto' }}>
        <Typography variant="h5" gutterBottom style={{ padding: '10px' }}>
          Transactions:
        </Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 950 }} aria-label="Transactions table">
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableCell key={header}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {currentPageTransactions.map((transaction, index) => (
                <TableRow
                  key={transaction.uniqueId + '-' + index}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    backgroundColor:
                      index % 2 ? 'rgba(0, 0, 0, 0.04)' : 'inherit',
                  }}
                >
                  <TableCell
                    style={{ wordWrap: 'break-word', maxWidth: '150px' }}
                  >
                    {transaction.blockNum}
                  </TableCell>
                  <TableCell
                    style={{ wordWrap: 'break-word', maxWidth: '150px' }}
                  >
                    {transaction.uniqueId}
                  </TableCell>
                  <TableCell
                    style={{ wordWrap: 'break-word', maxWidth: '150px' }}
                  >
                    {transaction.hash}
                  </TableCell>
                  <TableCell
                    style={{ wordWrap: 'break-word', maxWidth: '150px' }}
                  >
                    {transaction.from}
                  </TableCell>
                  <TableCell
                    style={{ wordWrap: 'break-word', maxWidth: '150px' }}
                  >
                    {transaction.to}
                  </TableCell>
                  <TableCell>
                    {isNaN(transaction.value)
                      ? 'Invalid Value'
                      : transaction.value}
                  </TableCell>
                  <TableCell>{transaction.asset}</TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>{transaction.rawContract?.value}</TableCell>
                  <TableCell>{transaction.metadata?.blockTimestamp}</TableCell>
                  <TableCell>{transaction.chainId}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[]}
                  colSpan={5} // updated colspan to 5 as there are 5 columns now
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: { 'aria-label': 'rows per page' },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </div>
    );
  };

  return (
    <div>
      {!showTransactionsTable ? (
        <Button
          variant="contained"
          color="secondary"
          style={{ marginTop: '20px' }}
          size="small"
          onClick={() => setShowTransactionsTable(true)}
        >
          Show Transactions Table
        </Button>
      ) : (
        renderTable(transactions, [
          'Block Number',
          'Unique ID',
          'Hash',
          'From',
          'To',
          'Value',
          'Asset',
          'Category',
          'Contract Value',
          'Timestamp',
          'Chain ID',
        ])
      )}
    </div>
  );
}
TransactionsDashboard.propTypes = {
  tab: PropTypes?.number,
  showTable: PropTypes?.bool,
  setShowTable: PropTypes?.func,
  message: PropTypes?.string,
  page: PropTypes?.number,
  setPage: PropTypes?.func,
  setLoadingTransactions: PropTypes?.func,
};

export default TransactionsDashboard;
