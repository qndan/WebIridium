// the library is called "react-plotly.js," but this is a `.tsx` file.

const MockPlot = (props: { [prop: string]: unknown }) => {
  return <div {...props}>{JSON.stringify(props)}</div>;
};

export default MockPlot;
