import React, { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const ChartComponent = ({ selectedItem }) => {
  const [chartData, setChartData] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedItem) return;

      const sheetName = `${selectedItem}_차트데이터`;
      try {
        const response = await fetch(`/api/chartdataapi?sheetName=${sheetName}`);
        const data = await response.json();

        if (data.error) {
          console.error(data.error);
          return;
        }

        const labels = Array.from(new Set(data.slice(1).map(row => row[0].replace(/^\d+년/, '')))); // 연도 제거
        const prices2023 = Array(labels.length).fill(null);
        const prices2024 = Array(labels.length).fill(null);

        data.slice(1).forEach(row => {
          const [date, price] = row;
          const week = date.replace(/^\d+년/, ''); // 연도 제거 후 주차만 추출
          const index = labels.indexOf(week);

          if (index !== -1) {
            if (date.includes('2023년')) {
              prices2023[index] = parseInt(price);
            } else if (date.includes('2024년')) {
              prices2024[index] = parseInt(price);
            }
          }
        });

        // 7월 3주와 7월 4주 인덱스 찾기
        const highlightIndex3rdWeek = labels.indexOf('7월3주');
        const highlightIndex4thWeek = labels.indexOf('7월4주');

        setChartData({
          labels: labels, // 연도가 제거된 라벨을 사용
          datasets: [
            {
              label: `2023년 ${selectedItem} 가격`,
              data: prices2023,
              borderColor: 'rgba(75,192,192,1)',
              backgroundColor: 'rgba(75,192,192,0.2)',
              pointBackgroundColor: prices2023.map((_, index) =>
                index === highlightIndex3rdWeek ? 'yellow' :
                index === highlightIndex4thWeek ? 'green' : 
                'rgba(75,192,192,1)'
              ), // 강조된 점의 크기 설정
            },
            {
              label: `2024년 ${selectedItem} 가격`,
              data: prices2024,
              borderColor: 'rgba(192,75,75,1)',
              backgroundColor: 'rgba(192,75,75,0.2)',
              pointBackgroundColor: prices2024.map((_, index) =>
                index === highlightIndex3rdWeek ? 'yellow' :
                index === highlightIndex4thWeek ? 'green' : 
                'rgba(192,75,75,1)'
              ), // 7월 3주에 노란색, 7월 4주에 초록색 적용
              pointRadius: prices2024.map((_, index) =>
                index === highlightIndex3rdWeek || index === highlightIndex4thWeek ? 6 : 3
              ), // 강조된 점의 크기 설정
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchData();
  }, [selectedItem]);

  useEffect(() => {
    if (chartData && chartRef.current) {
      const chart = chartRef.current;

      // 7월 3주와 7월 4주 데이터 인덱스 찾기
      const dataIndex3rdWeek = chartData.labels.indexOf('7월3주');
      const dataIndex4thWeek = chartData.labels.indexOf('7월4주');

      if (dataIndex3rdWeek !== -1 && dataIndex4thWeek !== -1 && chart.data.datasets[1]) {
        // 고정된 위치에 7월 3주 라벨을 표시
        const chartContainer = chart.canvas.parentNode; // 차트 컨테이너 찾기
        const tooltipEl3rdWeek = document.createElement('div');
        tooltipEl3rdWeek.style.position = 'absolute';
        tooltipEl3rdWeek.style.background = 'rgba(0, 0, 0, 0.8)';
        tooltipEl3rdWeek.style.color = '#fff';
        tooltipEl3rdWeek.style.padding = '10px';
        tooltipEl3rdWeek.style.borderRadius = '4px';
        tooltipEl3rdWeek.style.pointerEvents = 'none';
        tooltipEl3rdWeek.style.left = '50%';
        tooltipEl3rdWeek.style.transform = 'translateX(-100%)'; // 왼쪽에 위치
        tooltipEl3rdWeek.style.top = '-30px'; // 차트 바로 위쪽에 위치
        tooltipEl3rdWeek.innerHTML = `<strong>2024년 7월 3주: ${chart.data.datasets[1].data[dataIndex3rdWeek]}원</strong>`;

        chartContainer.appendChild(tooltipEl3rdWeek);

        // 고정된 위치에 7월 4주 라벨을 표시
        const tooltipEl4thWeek = document.createElement('div');
        tooltipEl4thWeek.style.position = 'absolute';
        tooltipEl4thWeek.style.background = 'rgba(0, 0, 0, 0.8)';
        tooltipEl4thWeek.style.color = '#fff';
        tooltipEl4thWeek.style.padding = '10px';
        tooltipEl4thWeek.style.borderRadius = '4px';
        tooltipEl4thWeek.style.pointerEvents = 'none';
        tooltipEl4thWeek.style.left = '50%';
        tooltipEl4thWeek.style.transform = 'translateX(0%)'; // 오른쪽에 위치
        tooltipEl4thWeek.style.top = '-30px'; // 차트 바로 위쪽에 위치
        tooltipEl4thWeek.innerHTML = `<strong>2024년 7월 4주: ${chart.data.datasets[1].data[dataIndex4thWeek]}원</strong>`;

        chartContainer.appendChild(tooltipEl4thWeek);
      }
    }
  }, [chartData]);

  if (!chartData) return <p>차트를 로드 중입니다...</p>;

  return (
    <div style={{ width: '600px', margin: '0 auto', padding: '20px', position: 'relative' }}>
      <div style={{ height: '400px', position: 'relative' }}> {/* position: 'relative' 추가 */}
        <Line 
          ref={chartRef} 
          data={chartData} 
          options={{
            responsive: false,
            maintainAspectRatio: false,
            plugins: {
              tooltip: {
                enabled: false,
              },
              legend: {
                display: true,
                position: 'bottom', // 레전드를 차트 하단에 위치시킴
              },
            },
            interaction: {
              mode: 'none',
            },
            hover: {
              mode: null,
            },
          }} 
          height={400} 
          width={600} 
        />
      </div>
    </div>
  );
};

export default ChartComponent;
