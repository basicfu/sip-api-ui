export default theme => ({
  drawer: {
    width: '100%',
    height: 'calc( 100% - 49px )',
    flexShrink: 0,
  },
  drawerPaper: {
    width: '100%',
    position: 'inherit',
  },
  moreOperation: {
    position: 'absolute',
    right: 0,
  },
  listIcon: {
    margin: '0',
    '& svg:hover': {
      color: 'rgba(254, 169, 0, 0.9)'
    }
  },
  listText: {
    padding: '0 6px',
    '& span': {
      color: 'rgba(0, 0, 0, 0.65)',
      fontSize: '0.875rem',
      letterSpacing: '0.02857em',
    },
  },
  listSelected: {
    fontWeight: theme.typography.fontWeightMedium,
    borderRight: '3px solid #1890ff',
    '& span': {
      color: '#1890ff',
    },
    '& svg': {
      color: '#1890ff',
    },
    backgroundColor: '#e6f7ff!important',
  },
  input: {
    width: 'calc( 100% - 106px )',
    margin: '0 10px 0 0',
  },
  operationOption: {
    position: 'absolute',
    right: 0,
    top: 180,
    zIndex: 99999,
    backgroundColor: '#fff'
  },
  operationOptionItem: {
    paddingTop: '5px',
    paddingBottom: '5px',
  },
  operationOptionIcon: {
    marginRight: 0,
  },
  operationOptionText: {
    padding: '0 4px',
    '& span': {
      color: 'rgba(0, 0, 0, 0.65)',
      fontSize: '12px',
      letterSpacing: '0.02857em',
    },
  },
  method: {
    fontSize: '0.7rem',
    width: 28,
    textAlign: 'center',
  },
  methodGET: {
    color: 'rgba(24, 171, 105, 0.9)',
  },
  methodPOST: {
    color: 'rgba(254, 169, 0, 0.9)',
  },
  methodPUT: {
    color: 'rgba(34, 102, 242, 0.9)',
  },
  methodPATCH: {
    color: 'rgba(137, 137, 137, 0.9)',
  },
  methodDELETE: {
    color: 'rgba(236, 85, 86, 0.9)',
  },
  methodHEAD: {
    color: 'rgba(137, 137, 137, 0.9)',
  },
  methodOPTIONS: {
    color: 'rgba(137, 137, 137, 0.9)',
  },
});
