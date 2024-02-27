interface WalletBalance {
  currency: string;
  amount: number;
}

//should use extends from WalletBalance for more extendibility in the future
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

class Datasource {
  // TODO: Implement datasource class
}

//not sure what this does. What is BoxProps? where is Boxprops?
interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = (props: Props) => {
  //could do destructuring on the top line. Not sure whats the standard practice
  const { children, ...rest } = props;
  //could use the WalletBlance as a Type here for clarity since there is multiple WalletBalance types and to ensure useWalletBalance returns
  //correct type
  const balances = useWalletBalances();
  //could add prices Type for this.
  const [prices, setPrices] = useState({});

  useEffect(() => {
    //url could be stored in .env file if used frequently
    const datasource = new Datasource(
      "https://interview.switcheo.com/prices.json"
    );
    //type of prices not defined. Could create new Prices type interface
    //could use try catch instead for catching error
    datasource
      .getPrices()
      .then((prices) => {
        setPrices(prices);
        //Coud be more specific with what type of error we are catching, also instead of console.error could throw an actual Error and return
        //a ui pop up
      })
      .catch((error) => {
        console.err(error);
      });
  }, []);

  //type of blockchain data could be more specific if possible
  //not sure if using switch statement increases look up time instead of using a normal array
  const getPriority = (blockchain: any): number => {
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      case "Zilliqa":
        return 20;
      case "Neo":
        return 20;
      default:
        return -99;
    }
  };

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        //what is lhsPriority?
        if (lhsPriority > -99) {
            //shouldnt the logic be the oppisite since we want wallet with money
          if (balance.amount <= 0) {
            return true;
          }
        }
        return false;
        //WalletBalance dont have blockchain property
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
        //what if rightprio=leftprio?
      });
  }, [balances, prices]);

  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    };
  });

  const rows = sortedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      //should change usdValue variable name as usdValue={usdValue} is now referring to the wrong usdValue. Should add check 
      //to see whether prices and balances are null or not
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );

  //are we supposed to use the destructured 'children' somewhere?
  return <div {...rest}>{rows}</div>;
};
