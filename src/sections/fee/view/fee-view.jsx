import axios from 'axios';
import React, { useMemo, useState, useEffect, useCallback } from 'react';

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import AppWidgetSummary from '../app-widget-summary';
import AppWebsiteVisits from '../app-website-visits';
import AppCurrentVisits from '../app-current-visits';

const databaseLocalUrl = `${import.meta.env.VITE_DATABASE_LOCAL}`;

export default function FeeView() {
  const [academicYear, setAcademicYear] = useState('');
  const [yearName, setYearName] = useState('');
  const [prn, setPrn] = useState('');
  // const [feeCode, setFeeCode] = useState('');
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
      developmentfee: 0,
      other: 0,
      cautionmoney: 0,
    }),
    []
  );
  const [paidData, setPaidData] = useState(initialFeeData);
  const [totalFeeData, setTotalFeeData] = useState(initialFeeData);

  let token;
  const cookieValue = document.cookie.split('; ').find((row) => row.startsWith('jwt'));
  const localStorageValue = localStorage.getItem('jwt');
  if (cookieValue) {
    token = cookieValue.split('=')[1];
  } else if (localStorageValue) {
    token = localStorageValue;
  }

  const fetchStudentData = useCallback(async () => {
    try {
      const response = await axios.get(`${databaseLocalUrl}/student/${prn}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status === 'success') {
        const studentData = response.data.data.data;
        setStudentName(studentData.name);
        // setFeeCode(studentData.feestructure);
        setAddYear(studentData.admissionyear);
      } else {
        // Reset data if student is not found
        setStudentName('Student not found');
        // setFeeCode('');
        setAddYear('20XX-XX');
        setPaidData(initialFeeData);
        setTotalFeeData(initialFeeData);
      }
    } catch (error) {
      if (
        error instanceof TypeError &&
        error.message.includes('Cannot read properties of undefined')
      ) {
        console.error('Please Login to Access.');
      } else {
        console.error('Error fetching student data:', error.message);
      }
      setStudentName('');
    }
  }, [prn, initialFeeData, token]);

  const fetchPaidData = useCallback(async () => {
    try {
      const response = await axios.post(
        `${databaseLocalUrl}/transaction/sum`,
        {
          academicyear: academicYear,
          yearname: yearName,
          PRN: prn,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status === 'success') {
        const { data } = response.data.data;
        setPaidData({
          scholarship: parseFloat(data.scholarship),
          tuitionfees: parseFloat(data.tuitionfees),
          eligibilityregistration: parseFloat(data.eligibilityregistration),
          universityfees: parseFloat(data.universityfees),
          library: parseFloat(data.library),
          collegeexam: parseFloat(data.collegeexam),
          developmentfee: parseFloat(data.developmentfee),
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
  }, [prn, initialFeeData, academicYear, yearName, token]);

  const fetchTotalFeeData = useCallback(async () => {
    try {
      const response = await axios.post(
        `${databaseLocalUrl}/feestructure/summary/`,
        {
          admissionyear: academicYear,
          yearname: yearName,
          PRN: prn,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status === 'success') {
        const { data } = response.data;
        // Set unpaid amount as total - paidSum
        setTotalFeeData({
          scholarship: parseFloat(data[0].scholarship),
          tuitionfees: parseFloat(data[0].tuitionfees),
          eligibilityregistration: parseFloat(data[0].eligibilityregistration),
          universityfees: parseFloat(data[0].universityfees),
          library: parseFloat(data[0].library),
          collegeexam: parseFloat(data[0].collegeexam),
          developmentfee: parseFloat(data[0].developmentfee),
          other: parseFloat(data[0].other),
          cautionmoney: parseFloat(data[0].cautionmoney),
        });
      } else {
        // Reset totalFeeData if request fails
        setTotalFeeData(initialFeeData);
        console.error('Error fetching Total fee data:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching Total fee data:', error.message);
    }
  }, [initialFeeData, academicYear, yearName, prn, token]);

  // const fetchData = useCallback(async () => {
  //   try {
  // const token =
  //   document.cookie
  //     .split('; ')
  //     .find((row) => row.startsWith('jwt'))
  //     .split('=')[1] || localStorage.getItem('jwt');

  //     // Make the GET request with the Authorization header
  //     const response = await axios.get(`${databaseLocalUrl}/student`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     const data = await response.data;

  //     // Extract unique academic years and year names
  //     const uniqueAcademicYears = Array.from(
  //       new Set(data.data.map((student) => student.admissionyear))
  //     );
  //     const uniqueYearNames = Array.from(new Set(data.data.map((student) => student.yearname)));

  //     // Set state for academicYear and yearName
  //     setAcademicYear(uniqueAcademicYears);
  //     setYearName(uniqueYearNames);
  //   } catch (error) {
  //     if (
  //       error instanceof TypeError &&
  //       error.message.includes('Cannot read properties of undefined')
  //     ) {
  //       console.error('Please Login to Access.');
  //     } else {
  //       console.error('Error fetching students data:', error.message);
  //     }
  //     setAcademicYear([]);
  //     setYearName([]);
  //   }
  // });

  useEffect(() => {
    if (prn) {
      fetchStudentData();
    }
    fetchPaidData();
    fetchTotalFeeData();
  }, [prn, fetchStudentData, fetchPaidData, fetchTotalFeeData, initialFeeData]);

  const handlePrnChange = (event) => {
    setPrn(event.target.value);
    setStudentName();
    // setFeeCode('');
    setAddYear('20XX-XX');
    setPaidData(initialFeeData);
    setTotalFeeData(initialFeeData);
  };

  const handleNameChange = (event) => {
    setStudentName(event.target.value);
  };

  const paidSum = Object.values(paidData).reduce((a, b) => a + b, 0);
  const total = Object.values(totalFeeData).reduce((a, b) => a + b, 0);
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
                Select AcademicYear:
              </Typography>
              <Select
                variant="outlined"
                fullWidth
                value={academicYear}
                onChange={(event) => setAcademicYear(event.target.value)}
                sx={{ flex: 3 }}
              >
                <MenuItem value="">All Year</MenuItem>
                <MenuItem value="2024-25">2024-25</MenuItem>
                <MenuItem value="2023-24">2023-24</MenuItem>
                <MenuItem value="2022-23">2022-23</MenuItem>
                <MenuItem value="2021-22">2021-22</MenuItem>
                <MenuItem value="2020-21">2020-21</MenuItem>
              </Select>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <Card>
            <CardContent sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Typography sx={{ fontSize: 18, fontWeight: 'bold', mr: 4, ml: 1 }}>
                Select YearName:
              </Typography>
              <Select
                variant="outlined"
                fullWidth
                value={yearName}
                onChange={(event) => setYearName(event.target.value)}
                sx={{ flex: 3 }}
              >
                <MenuItem value="">All Year</MenuItem>
                <MenuItem value="1st Year">1st Year</MenuItem>
                <MenuItem value="2nd Year">2nd Year</MenuItem>
                <MenuItem value="3rd Year">3rd Year</MenuItem>
                <MenuItem value="4th Year">4th Year</MenuItem>
              </Select>
            </CardContent>
          </Card>
        </Grid>

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
            title="Admission Year"
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
                'Tuition',
                'Eligibility',
                'University',
                'Library',
                'Exam',
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
                  data: Object.values(totalFeeData).map(
                    (value, index) => value - paidData[Object.keys(paidData)[index]]
                  ),
                },
                {
                  name: 'Total',
                  type: 'area',
                  fill: 'gradient',
                  data: Object.values(totalFeeData),
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
