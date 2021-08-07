//
import _ from "lodash";
import { observer } from "mobx-react";
import React from "react";
import ReactModal from "react-modal";
import styles from "./Modal.module.scss";

// Extend the class
class OReactModal extends ReactModal {
    //

    // Override displayName
    static displayName = "ReactModal";

    // Override default styles
    static defaultStyles = {
        overlay: {},
        content: {},
    };
}

export interface ModalProps extends GenericComponentProps {
    open: boolean;
    onOpen?: Function;
    onDismiss?: Function;
    innerOverlayRef?: Function;
    innerModalRef?: Function;
}

interface renderModalOptions {
    modalClassName?: string;
    overlayClassName?: string;
    portalClassName?: string;
}

@observer
export default class Modal<T extends ModalProps> extends React.Component<T> {
    //

    modalRef: any;
    overlayRef: any;

    parentSelector = () => document.querySelector("body") as HTMLElement;

    // -----------------------
    // event handling methods
    // -----------------------

    trigger = (
        eventName: "onOpen" | "onDismiss" | "innerOverlayRef" | "innerModalRef",
        ...args: any[]
    ) => {
        const fn: any = this.props[eventName];

        if (fn) {
            fn(...args);
        }
    };

    onAfterOpen = () => {
        this.trigger("onOpen");
    };

    onRequestClose = () => {
        this.trigger("onDismiss");
    };

    onCloseClick = () => {
        this.onRequestClose();
    };

    // -----------------------
    // ref methods
    // -----------------------

    registerOverlayRef = (ref: any) => {
        this.overlayRef = ref;

        this.trigger("innerOverlayRef", ref);
    };

    registerModalRef = (ref: any) => {
        this.modalRef = ref;

        this.trigger("innerModalRef", ref);
    };

    // =======================
    // rendering methods
    // =======================

    render() {
        if (!this.props.open) {
            return null;
        }

        return this.renderModal({});
    }

    renderModal(opts: renderModalOptions) {
        opts = _.defaults(opts, {
            modalClassName: styles.modalModal,
            overlayClassName: styles.modalOverlay,
            portalClassName: styles.modalPortal,
        });

        return (
            <OReactModal
                isOpen={this.props.open}
                ariaHideApp={false}
                shouldCloseOnEsc={true}
                shouldFocusAfterRender={false}
                shouldCloseOnOverlayClick={true}
                shouldReturnFocusAfterClose={false}
                parentSelector={this.parentSelector}
                className={opts.modalClassName}
                portalClassName={opts.portalClassName}
                overlayClassName={opts.overlayClassName}
                bodyOpenClassName={null}
                htmlOpenClassName={null}
                overlayRef={this.registerOverlayRef}
                contentRef={this.registerModalRef}
                onAfterOpen={this.onAfterOpen}
                onRequestClose={this.onRequestClose}
            >
                {this.renderModalContent()}
            </OReactModal>
        );
    }

    renderModalContent() {
        return this.props.children;
    }
}
