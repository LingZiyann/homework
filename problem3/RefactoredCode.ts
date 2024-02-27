interface WalletBalance {
  currency: string;
  amount: number;
  blockchain?: string; 
}
interface FormattedWalletBalance extends WalletBalance{
  formatted: string;
}

class Datasource {
    private url: string;

    constructor(url: string) {
        this.url = url;
    }

    async getPrices() {
        try {
            const response = await fetch(this.url);
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch prices:', error);
            throw error;
        }
    }
}

interface Props extends BoxProps {

}

interface Prices {

}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  //returns WalletBalance 
  const balances: WalletBalance = useWalletBalances();
  const [prices, setPrices] = useState<Prices>({});

  useEffect(() => {
    const datasource = new Datasource(
      process.env.URL
    );
    datasource.getPrices().then((prices) => {
        setPrices(prices);
    }).catch((error) => {
        console.error(error);
    });
  }, []);

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
        if (balancePriority > -99) {
          if (balance.amount <= 0) {
            return false;
          }
        }
        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        } else {
          return 0;
        }
      });
  }, [balances, prices]);


  const rows = sortedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      if (prices != null && balance != null) {
        const newUsdValue = prices[balance.currency] * balance.amount;
      }
      return (
        <WalletRow
          className={classes.row}
          key={index}
          amount={balance.amount}
          usdValue={newUsdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );

  return (
    <div {...rest}>
        {rows}
    </div>
  )
};
