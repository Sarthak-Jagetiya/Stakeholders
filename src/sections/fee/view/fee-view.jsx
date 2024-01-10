import axios from 'axios';
import React, { useMemo, useState, useEffect, useCallback } from 'react';

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import AppWidgetSummary from '../app-widget-summary';
import AppWebsiteVisits from '../app-website-visits';
import AppCurrentVisits from '../app-current-visits';

export default function FeeView() {
  const [prn, setPrn] = useState('');
  const [feeCode, setFeeCode] = useState('');
  const [studentName, setStudentName] = useState('');
  const [addYear, setAddYear] = useState('20XX-XX');
  const initialFeeData = useMemo(
    () => ({
      scholarship: 0,
      tuitionfees: 0,
      eligibilityregistration: 0,
      universityfees: 0,
      library: 0,
      collegeexam: 0,
      other: 0,
      cautionmoney: 0,
    }),
    []
  );
  const [paidData, setPaidData] = useState(initialFeeData);
  const [unpaidData, setUnpaidData] = useState(initialFeeData);

  const fetchStudentData = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/student/${prn}`);
      if (response.data.status === 'success') {
        const studentData = response.data.data.data;
        setStudentName(studentData.name);
        setFeeCode(studentData.feestructure);
        setAddYear(studentData.admissionyear);
      } else {
        // Reset data if student is not found
        setStudentName('Student not found');
        setFeeCode('');
        setAddYear('20XX-XX');
        setPaidData(initialFeeData);
        setUnpaidData(initialFeeData);
      }
    } catch (error) {
      console.error('Error fetching student data:', error.message);
      setStudentName('');
    }
  }, [prn, initialFeeData]);

  const fetchPaidData = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/transaction/sum/${prn}`);
      if (response.data.status === 'success') {
        const { data } = response.data.data;
        setPaidData({
          scholarship: parseFloat(data.scholarship),
          tuitionfees: parseFloat(data.tuitionfees),
          eligibilityregistration: parseFloat(data.eligibilityregistration),
          universityfees: parseFloat(data.universityfees),
          library: parseFloat(data.library),
          collegeexam: parseFloat(data.collegeexam),
          other: parseFloat(data.other),
          cautionmoney: parseFloat(data.cautionmoney),
        });
      } else {
        // Reset paidData if request fails
        setPaidData(initialFeeData);
        console.error('Error fetching paid data:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching paid data:', error.message);
    }
  }, [prn, initialFeeData]);

  const fetchUnpaidData = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/feestructure/${feeCode}`);
      if (response.data.status === 'success') {
        const { data } = response.data.data;
        // Set unpaid amount as total - paidSum
        setUnpaidData({
          scholarship: parseFloat(data.scholarship),
          tuitionfees: parseFloat(data.tuitionfees),
          eligibilityregistration: parseFloat(data.eligibilityregistration),
          universityfees: parseFloat(data.universityfees),
          library: parseFloat(data.library),
          collegeexam: parseFloat(data.collegeexam),
          other: parseFloat(data.other),
          cautionmoney: parseFloat(data.cautionmoney),
        });
      } else {
        // Reset unpaidData if request fails
        setUnpaidData(initialFeeData);
        console.error('Error fetching unpaid data:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching unpaid data:', error.message);
    }
  }, [feeCode, initialFeeData]);

  useEffect(() => {
    if (prn) {
      fetchStudentData();
      fetchPaidData();
      fetchUnpaidData();
    }
  }, [prn, fetchStudentData, fetchPaidData, fetchUnpaidData, initialFeeData]);

  const handlePrnChange = (event) => {
    setPrn(event.target.value);
    setStudentName();
    setFeeCode('');
    setAddYear('20XX-XX');
    setPaidData(initialFeeData);
    setUnpaidData(initialFeeData);
  };

  const handleNameChange = (event) => {
    setStudentName(event.target.value);
  };

  const paidSum = Object.values(paidData).reduce((a, b) => a + b, 0);
  const total = Object.values(unpaidData).reduce((a, b) => a + b, 0);
  const unpaidSum = total - paidSum;

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={6}>
          <Card>
            <CardContent sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Typography sx={{ fontSize: 18, fontWeight: 'bold', mr: 4, ml: 1 }}>
                Enter Student PRN:
              </Typography>
              <TextField
                variant="outlined"
                fullWidth
                value={prn}
                onChange={handlePrnChange}
                sx={{ flex: 3 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <Card>
            <CardContent sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Typography sx={{ fontSize: 18, fontWeight: 'bold', mr: 4, ml: 1 }}>
                Student Name:
              </Typography>
              <TextField
                variant="outlined"
                fullWidth
                value={studentName}
                onChange={handleNameChange}
                sx={{ flex: 3 }}
                disabled
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Session Schedule"
            total={`₹${total}`}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Session Paid"
            total={`₹${paidSum}`}
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Amount Due"
            total={`₹${unpaidSum}`}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Session Year"
            total={addYear}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={8}>
          <AppWebsiteVisits
            title="Fee Analysis"
            subheader="(section wise fee analysis)"
            chart={{
              labels: [
                'Scholarship',
                'TuitionFees',
                'Eligibility',
                'UniversityFees',
                'Library',
                'CollegeExam',
                'Other',
                'CautionMoney',
              ],
              series: [
                {
                  name: 'Paid',
                  type: 'column',
                  fill: 'solid',
                  data: Object.values(paidData),
                },
                {
                  name: 'Unpaid',
                  type: 'column',
                  fill: 'solid',
                  data: Object.values(unpaidData).map(
                    (value, index) => value - paidData[Object.keys(paidData)[index]]
                  ),
                },
                {
                  name: 'Total',
                  type: 'area',
                  fill: 'gradient',
                  data: Object.values(unpaidData),
                },
              ],
              colors: ['#1877f2', '#ffab00', '#ff5630'],
            }}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <AppCurrentVisits
            title="Fee Pending"
            chart={{
              series: [
                { label: 'Paid', value: paidSum || 1 },
                { label: 'Unpaid', value: unpaidSum || 0 },
              ],
              colors: ['#1877f2', '#ff5630'],
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
