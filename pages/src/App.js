import './App.css';
import { Button, Container, Header, Table, Label } from 'semantic-ui-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState();

  useEffect(() => {
    const intervalId = setInterval(() =>
      axios.get('https://game-server-live-status-api.thomas1234567123123.workers.dev/')
        .then((response) => {
          setData(response.data);
        })
        .catch(() => {})
    , 1000);
    return () => clearInterval(intervalId);
  }, []);

  const rows = !data ? [] : data.servers.map((server, key) => {
    const bots = server.info.Bots === 0 ? '' : ` (${server.info.Bots})`;

    return (
      <Table.Row key={key}>
        <Table.Cell>{server.info.HostName}</Table.Cell>
        <Table.Cell>{server.info.Map}</Table.Cell>
        <Table.Cell>{server.info.Players}{bots}/{server.info.MaxPlayers}</Table.Cell>
        <Table.Cell>{server.info.ModDesc}</Table.Cell>
        <Table.Cell>
          <Button primary onClick={() => { window.location.href = `steam://connect/${server.ip}:${server.port}`}}>Join now</Button>
        </Table.Cell>
      </Table.Row>
    )
  })

  return (
    <Container style={{paddingTop: 45, paddingBottom: 45}}>
      <Header as='h2'>Game Server Live Status</Header>

      <Table singleLine selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Map</Table.HeaderCell>
            <Table.HeaderCell>Players</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {data && rows}
        </Table.Body>

        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan='5'>
              <Label ribbon>Last Update: {data && Math.floor((new Date().getTime() - new Date(data.updated).getTime()) / 1000 % 60)} seconds ago</Label>
              <Label horizontal>Auto refresh every 2 minutes</Label>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>

      <Header as='h2'>How does it work</Header>
      <p>
        This application uses Cloudflare Workers to query the servers with crontab and cached the servers' status in KV storage, so the end users can receieve the servers' status faster.
        Moreover, we can use Cloudflare Workers as an additional layer to cache the data so our backend server can reduce loading.
      </p>

      <Table singleLine selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Cloudflare Product Used</Table.HeaderCell>
            <Table.HeaderCell>Usage</Table.HeaderCell>
            <Table.HeaderCell>Github</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.Cell>Workers</Table.Cell>
            <Table.Cell>Provide API Endpoint</Table.Cell>
            <Table.Cell>
              <a href="https://github.com/tatlead/GameServerLiveStatus/tree/main/workers" target="_blank" rel="noreferrer">https://github.com/tatlead/GameServerLiveStatus/tree/main/workers</a>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Workers KV</Table.Cell>
            <Table.Cell>Cache the servers' status in key-value data store</Table.Cell>
            <Table.Cell>
              
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Pages</Table.Cell>
            <Table.Cell>Frontend Application</Table.Cell>
            <Table.Cell>
              <a href="https://github.com/tatlead/GameServerLiveStatus/tree/main/pages" target="_blank" rel="noreferrer">https://github.com/tatlead/GameServerLiveStatus/tree/main/pages</a>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </Container>
  );
}

export default App;
