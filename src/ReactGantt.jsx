import React, {Component} from 'react'
import PropTypes from 'prop-types'
import GanttJS from 'frappe-gantt'
import {bind, clear} from 'size-sensor'
import {noop, nullop} from './utils/helper'

class ReactGantt extends Component {
    ganttRef = undefined;

    componentDidMount() {
        this.renderFrappeGanttDOM()
    }

    // redraw the gantt when update. now change the viewMode
    componentDidUpdate(prevProps, prevState) {
        if (this.ganttInst) {
            this.ganttInst.refresh(this.props.tasks)
            // 不相等才刷新
            if (this.props.viewMode !== prevProps.viewMode) {
                this.ganttInst.change_view_mode(this.props.viewMode)
            }
        }
    }

    componentWillUnmount() {
        clear(this.ganttRef)
    }

    /**
     * render the gantt chart
     * @returns {GanttJS}
     */
    renderFrappeGanttDOM() {
        // init the Gantt
        // if exist, return
        if (this.ganttInst) return this.ganttInst

        const {
            onClick,
            onDateChange,
            onProgressChange,
            onViewChange,

            tasks,
            customPopupHtml,
            viewModes,
            viewMode,

            dateFormat,
            headerHeight,
            columnWidth,
            step,
            barHeight,
            barCornerRadius,
            arrowCurve,
            padding,
        } = this.props

        // when resize
        bind(this.ganttRef, () => {
            if (this.ganttInst) {
                this.ganttInst.refresh(this.props.tasks)
            }
        })

        // new instance
        this.ganttInst = new GanttJS(this.ganttRef, tasks, {
            on_click: onClick || noop,
            on_date_change: onDateChange || noop,
            on_progress_change: onProgressChange || noop,
            on_view_change: onViewChange || noop,
            custom_popup_html: customPopupHtml || nullop,

            view_modes: viewModes || ['Quarter Day', 'Half Day', 'Day', 'Week', 'Month'],

            header_height: headerHeight || 50,
            column_width: columnWidth || 30,
            step: step || 24,

            bar_height: barHeight || 20,
            bar_corner_radius: barCornerRadius || 3,
            arrow_curve: arrowCurve || 5,
            padding: padding || 18,
            date_format: dateFormat || 'YYYY-MM-DD',
        })
        // change view mode
        this.ganttInst.change_view_mode(viewMode)
        return this.ganttInst
    }

    render() {
        return (
            <svg ref={node => {
                this.ganttRef = node
            }}/>
        )
    }
}

ReactGantt.propTypes = {
    onClick: PropTypes.func,
    onDateChange: PropTypes.func,
    onProgressChange: PropTypes.func,
    onViewChange: PropTypes.func,
    customPopupHtml: PropTypes.func,

    tasks: PropTypes.any,
    viewModes: PropTypes.array,
    viewMode: PropTypes.string,

    dateFormat: PropTypes.string,
    headerHeight: PropTypes.number,
    columnWidth: PropTypes.number,
    step: PropTypes.number,
    barHeight: PropTypes.number,
    barCornerRadius: PropTypes.number,
    arrowCurve: PropTypes.number,
    padding: PropTypes.number
}

export default ReactGantt
