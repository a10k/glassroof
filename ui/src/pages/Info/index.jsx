import { Layout, Typography, List, Divider } from 'antd';

const { Content } = Layout;
const { Title, Paragraph, Text, Link } = Typography;

const privacyItems = [
  {
    label: 'No personal information collected',
    desc: 'We never ask for your name, email, phone number, or any identifying information.',
  },
  {
    label: 'Anonymous by default',
    desc: 'All rent data is submitted and stored anonymously. Your exact address is never recorded.',
  },
  {
    label: 'What we collect',
    desc: 'Only the rent amount, unit type (studio/1BR/2BR/3BR+), lease start month/year, and optional notes (utilities, parking, etc.).',
  },
  {
    label: 'Location data',
    desc: 'We store the coordinates you provide when dropping a pin. That location is used to display your submission on the map.',
  },
  {
    label: 'No accounts required',
    desc: 'Drop a pin, add rent, done. No sign-ups, no verification, no tracking.',
  },
  {
    label: 'Data security',
    desc: 'All data is encrypted in transit and at rest. We follow industry best practices for data protection.',
  },
];

export default function Info() {
  return (
    <Content style={{ minHeight: 'calc(100vh - 64px)', padding: '60px 24px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <Title level={2}>Privacy Policy</Title>
        <Paragraph type="secondary">
          Glassroof is built on the principle of privacy-first rent transparency.
        </Paragraph>
        <List
          dataSource={privacyItems}
          renderItem={({ label, desc }) => (
            <List.Item style={{ alignItems: 'flex-start', padding: '12px 0' }}>
              <List.Item.Meta title={<Text strong>{label}</Text>} description={desc} />
            </List.Item>
          )}
        />
        <Divider />
        <Title level={2}>Contact</Title>
        <Paragraph type="secondary">
          Questions, feedback, or concerns?{' '}
          <Link
            href="https://github.com/a10k/glassroof/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open an issue on GitHub
          </Link>
        </Paragraph>
      </div>
    </Content>
  );
}
