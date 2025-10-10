import { StyleSheet } from "react-native";




    

export const styles = StyleSheet.create({
    // global
    header:{fontSize:22},
    title:{fontSize:22},
    text:{fontSize:16},
    body:{fontSize:16},
    small:{fontSize:12},
    noteText:{fontSize:16, fontWeight:'300'},
    centerText:{textAlign:'center'},
    sectionSpacing:{marginTop:8, marginBottom:12},
    textInputStyle:{borderWidth:1, padding:8, borderRadius:6},
    flatListStyle:{marginTop:10},
    flatListRenderItem:{ flexDirection:"row", alignItems:"center", justifyContent:"space-between",
        paddingVertical:8, paddingHorizontal:4,borderTopWidth: StyleSheet.hairlineWidth},
    row:{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingVertical:8 },
    buttonContainer:{ marginVertical:6, marginHorizontal:6 },
    screenContainer: { flex:1, padding:16, gap:10 },

    // Home Screen
    homeContainer:{ flex:1 },
    homeScreenButton:{
        margin:5
    },
    homeScreenHeader:{
        fontSize:18,
        textAlign:"center",
        marginTop:10,
        marginBottom:10
    },

    // People Screen
    peopleList:{},



    // Items Screen
    previewImage: { width: '100%', height: 200, borderRadius: 12 },
    editSection: { paddingVertical:8, gap:6 },
    editButtonsRow: { flexDirection:'row', gap:10 },
    listItemTitle: { flexShrink: 1, marginRight: 8 },
    listItemActions: { width: 110, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 8 },
    linkEdit: { color: 'blue' },
    linkRemove: { color: 'red' },


    // Assign Screen
    assignContainer: { flex:1, padding:16 },
    assignTitle: { fontSize:22, marginBottom:10 },
    emptyStateContainer: { flex:1, justifyContent:'center', padding:20 },
    emptyStateText: { fontSize:18, textAlign:'center' },
    itemCard: { borderWidth:1, borderRadius:12, padding:12, marginBottom:12 },
    itemCardHeaderRow: { flexDirection:'row', justifyContent:'space-between', marginBottom:8 },
    itemCardTitle: { fontSize:16, fontWeight:'600' },
    itemCardSubtitle: { fontSize:12, fontWeight:'normal' },
    itemCardSelectedCount: { opacity: 0.7 },
    chipRow: { flexDirection:'row', gap:8, flexWrap:'wrap' },
    chip: { borderWidth:1, borderRadius:20, paddingVertical:6, paddingHorizontal:12 },
    chipOn: { backgroundColor: 'rgba(0,0,0,0.08)' },


    // Result Screen
})
