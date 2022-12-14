import { Text } from "@chakra-ui/react";
import React from "react";

const Price = (props: any) => {
  const { symbol } = props;
  const [price, setPrice] = React.useState<number | string>(0);
  const [status, setStatus] = React.useState("");

  function openSocket() {
    setStatus("Connecting...");
    const ws = new WebSocket("wss://production-esocket.delta.exchange");
    ws.addEventListener("open", (w) => {
      console.log("We are connected!");

      ws.send(
        JSON.stringify({
          type: "subscribe",
          payload: {
            channels: [{ name: "v2/ticker", symbols: [symbol] }],
          },
        })
      );
      setStatus("...");
    });

    ws.addEventListener("message", (m) => {
      setPrice("");
      setTimeout(() => {
        setPrice(
          isNaN(JSON.parse(m.data).mark_price)
            ? 0
            : (+JSON.parse(m.data).mark_price).toFixed(2)
        );
      }, 100);
    });
  }

  React.useEffect(() => {
    openSocket();
  }, []);
  return (
    <>
      {!price && (
        <Text py="2" w="full" noOfLines={1}>
          {status}
        </Text>
      )}
      {price !== 0 && (
        <Text fontWeight="bold" py="2">
          {price}
        </Text>
      )}
    </>
  );
};

export default Price;
