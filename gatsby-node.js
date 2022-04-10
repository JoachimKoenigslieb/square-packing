exports.onCreateWebpackConfig = ({ actions }) => {
	actions.setWebpackConfig({
		resolve: {
			alias: {
				'@mui/styled-engine': '@mui/styled-engine-sc',
			}
		}
	})
}