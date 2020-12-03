import { Card } from "react-bootstrap"

export type DataCardProps = {
    title: string;
    text: string;
}

const DataCard = (props: DataCardProps) => {
    return (
        <Card
        bg={'Light'}
        key={1}
        text={'dark'}
        style={{ }}
        className="mb-2">
        <Card.Header>{props.title}</Card.Header>
        <Card.Body>
            <Card.Text>{props.text}</Card.Text>
        </Card.Body>
    </Card>
    )
}

export default DataCard