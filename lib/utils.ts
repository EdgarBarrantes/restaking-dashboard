type BlockData = {
  total_amount: number;
  block_chunk: number;
  block_chunk_date: string;
};

function mergeBlockChunks(data: BlockData[]): BlockData[] {
  const mergedData: BlockData[] = [];

  data.forEach((item) => {
    const existingItem = mergedData.find(
      (entry) => entry.block_chunk === item.block_chunk
    );

    if (existingItem) {
      existingItem.total_amount += item.total_amount;
    } else {
      mergedData.push({ ...item });
    }
  });

  return mergedData;
}

function accumulateAmounts(data: BlockData[]): BlockData[] {
  const accumulatedData: BlockData[] = [];

  data.forEach((item, index) => {
    let total_amount = item.total_amount;

    if (index > 0) {
      total_amount += accumulatedData[index - 1].total_amount;
    }

    accumulatedData.push({ ...item, total_amount });
  });

  return accumulatedData;
}

function sumTotalAmounts(data: BlockData[]): number {
  let totalAmountSum = 0;

  data.forEach((item) => {
    totalAmountSum += item.total_amount;
  });

  return totalAmountSum;
}

function roundToDecimalPlaces(
  value: number,
  decimalPlaces: number = 2
): number {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(value * factor) / factor;
}

function formatDate(inputDate: string): string {
  const date = new Date(inputDate);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);

  return `${month}/${day}/${year}`;
}

function fillMissingDates(...arrays: BlockData[][]): BlockData[][] {
  const combinedDates = new Set(
    arrays.flatMap((arr) =>
      arr.map((item) => formatDate(item.block_chunk_date))
    )
  );

  const filledArray = (arr: BlockData[], dates: Set<string>): BlockData[] => {
    const dateMap = arr.reduce(
      (acc, item) => acc.set(item.block_chunk_date, item),
      new Map<string, BlockData>()
    );

    return Array.from(dates)
      .sort()
      .map((date) => {
        const item = dateMap.get(date);
        if (item) {
          return { ...item, block_chunk_date: formatDate(date) };
        } else {
          return {
            total_amount: 0,
            block_chunk: 0,
            block_chunk_date: formatDate(date),
          };
        }
      });
  };

  return arrays.map((arr) => filledArray(arr, combinedDates));
}

function fillMissingDatesWithPrevious(...arrays: BlockData[][]): BlockData[][] {
  const combinedDates = new Set(
    arrays.flatMap((arr) => arr.map((item) => item.block_chunk_date))
  );

  const filledArray = (arr: BlockData[], dates: Set<string>): BlockData[] => {
    const dateMap = arr.reduce(
      (acc, item) => acc.set(item.block_chunk_date, item),
      new Map<string, BlockData>()
    );

    let prevAmount = 0;

    return Array.from(dates)
      .sort()
      .map((date) => {
        const item = dateMap.get(date);
        if (item) {
          prevAmount = item.total_amount;
          return { ...item };
        } else {
          return {
            total_amount: prevAmount,
            block_chunk: 0,
            block_chunk_date: date,
          };
        }
      });
  };

  return arrays.map((arr) => filledArray(arr, combinedDates));
}

function extractAmountsAndTimestamps(...arrays: BlockData[][]): {
  amounts: number[][];
  timestamps: string[];
} {
  const combinedDates = new Set(
    arrays.flatMap((arr) =>
      arr.map((item) => formatDate(item.block_chunk_date))
    )
  );

  const filledArray = (arr: BlockData[], dates: Set<string>): BlockData[] => {
    const dateMap = arr.reduce(
      (acc, item) => acc.set(formatDate(item.block_chunk_date), item),
      new Map<string, BlockData>()
    );

    return Array.from(dates)
      .sort()
      .map((date) => {
        const item = dateMap.get(date);
        if (item) {
          return { ...item, block_chunk_date: formatDate(date) };
        } else {
          return {
            total_amount: 0,
            block_chunk: 0,
            block_chunk_date: formatDate(date),
          };
        }
      });
  };

  const filledArrays = arrays.map((arr) => filledArray(arr, combinedDates));

  const timestamps = Array.from(combinedDates).sort();
  const amounts = filledArrays.map((arr) =>
    arr.map((item) => item.total_amount)
  );

  return { amounts, timestamps };
}

function extractAmountsAndTimestampsWithPrevious(...arrays: BlockData[][]): {
  amounts: number[][];
  timestamps: string[];
} {
  const combinedDates = new Set(
    arrays.flatMap((arr) =>
      arr.map((item) => formatDate(item.block_chunk_date))
    )
  );

  const filledArray = (arr: BlockData[], dates: Set<string>): BlockData[] => {
    const dateMap = arr.reduce(
      (acc, item) => acc.set(formatDate(item.block_chunk_date), item),
      new Map<string, BlockData>()
    );

    let prevAmount = 0;

    return Array.from(dates)
      .sort()
      .map((date) => {
        const item = dateMap.get(date);
        if (item) {
          prevAmount = item.total_amount;
          return { ...item, block_chunk_date: formatDate(date) };
        } else {
          return {
            total_amount: prevAmount,
            block_chunk: 0,
            block_chunk_date: formatDate(date),
          };
        }
      });
  };

  const filledArrays = arrays.map((arr) => filledArray(arr, combinedDates));

  const timestamps = Array.from(combinedDates).sort();
  const amounts = filledArrays.map((arr) =>
    arr.map((item) => item.total_amount)
  );

  return { amounts, timestamps };
}

function subtractArrays(arr1: BlockData[], arr2: BlockData[]): BlockData[] {
  const combinedDates = new Set([
    ...arr1.map((item) => formatDate(item.block_chunk_date)),
    ...arr2.map((item) => formatDate(item.block_chunk_date)),
  ]);

  const dateMap = (arr: BlockData[]): Map<string, BlockData> =>
    arr.reduce(
      (acc, item) => acc.set(formatDate(item.block_chunk_date), item),
      new Map<string, BlockData>()
    );

  const dateMap1 = dateMap(arr1);
  const dateMap2 = dateMap(arr2);

  return Array.from(combinedDates)
    .sort()
    .map((date) => {
      const item1 = dateMap1.get(date) || {
        total_amount: 0,
        block_chunk: 0,
        block_chunk_date: formatDate(date),
      };
      const item2 = dateMap2.get(date) || {
        total_amount: 0,
        block_chunk: 0,
        block_chunk_date: formatDate(date),
      };

      return {
        total_amount: item1.total_amount - item2.total_amount,
        block_chunk: item1.block_chunk - item2.block_chunk,
        block_chunk_date: date,
      };
    });
}

export type { BlockData };

export {
  mergeBlockChunks,
  accumulateAmounts,
  sumTotalAmounts,
  roundToDecimalPlaces,
  formatDate,
  fillMissingDates,
  fillMissingDatesWithPrevious,
  extractAmountsAndTimestamps,
  extractAmountsAndTimestampsWithPrevious,
  subtractArrays,
};