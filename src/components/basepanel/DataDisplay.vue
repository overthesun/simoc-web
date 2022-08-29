<!--
This component renders {key: value} objects in a standard layout.

The 'data' prop (required):
- A JS Object of key:value pairs
- Keys are displayed on separate rows, left-aligned
- Values can be:
    - String or Number: inline, right-aligned
    - List: inline in columns, right-aligned
    - Object: key becomes a subheading, value displayed below (recursively)

The 'title' prop (optional):
- A JS Object of key:value pairs, mirroring structure of 'data'
- As matching Keys are rendered by 'data', Values added as 'title' (tooltip)

NOTE: Test color/style and updates should be handled *externally*. This
component just displays the values it gets.
 -->
 <template>
    <section class="data-display-wrapper">
        <table class="data-display">
            <template v-for="(item, index) in data" :key="`data_display_${index}`">
                <tr v-if="('number', 'string').includes(typeof(item))">
                    <td>{{stringFormatter(index)}}</td>
                    <td>{{stringFormatter(item)}}</td>
                </tr>
                <tr v-else-if="Array.isArray(item)">
                    <td>{{stringFormatter(index)}}</td>
                    <td v-for="it in item" :key="it">
                        {{stringFormatter(it)}}
                    </td>
                </tr>
                <template v-else-if="typeof(item) === 'object'">
                    <DataDisplay :data="item" :title="title[item]" :key="index + 'sub'"
                                 :indent="indent + '  '"/>
                </template>
            </template>
        </table>
    </section>
</template>

<script>
import {StringFormatter} from '../../javascript/utils'

export default {
    name: 'DataDisplay',
    props: {
        data: {type: Object, required: true},
        title: {type: Object, required: false},
        indent: {type: String, default: ''},
    },
    methods: {
        stringFormatter: StringFormatter,
    }
}
</script>

<style lang="scss" scoped>
.data-display-wrapper {
    overflow-y: auto;
}
.data-display {
    width: 100%;
}
.data-display th,
.data-display td {
    text-align: center;
    padding: 2px 0;
}

.data-display th:first-child,
.data-display td:first-child {
    text-align: left;
    overflow: hidden;
}
.data-display th:last-child,
.data-display td:last-child {
    text-align: right;
}

</style>
